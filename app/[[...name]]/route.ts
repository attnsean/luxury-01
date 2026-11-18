import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { resolveProjectData } from "@/lib/resolveProject";

export const dynamic = "force-dynamic";

const formatFallbackGuestName = (raw: string): string => {
  let name = raw;
  try {
    name = decodeURIComponent(raw);
  } catch {}
  name = name
    .replace(/%20/g, " ")
    .replace(/%25/g, " ")
    .replace(/%/g, " ")
    .replace(/\+/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return name
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
};

function parseDateParts(dateStr?: string | null) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const d = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
  return {
    dayDigit: parts[2],
    dayName: days[d.getDay()],
    monthName: months[parseInt(parts[1], 10) - 1],
    year: parts[0],
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name?: string[] }> }
) {
  const { searchParams } = new URL(request.url);
  const resolvedParams = await context.params;

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  let guestName = "Tamu Undangan";
  let hasSpecificGuest = false;

  const queryGuest =
    searchParams.get("to") ||
    searchParams.get("guest") ||
    searchParams.get("u") ||
    searchParams.get("n");

  const rawSlug = resolvedParams?.name?.[0];
  const slug = rawSlug && rawSlug !== "to" ? rawSlug : undefined;

  // Resolve project data from Supabase
  const resolvedData = await resolveProjectData(
    slug,
    host,
    queryGuest || undefined
  );
  const project = resolvedData.project;
  const events = resolvedData.events || [];
  const projectId =
    project?.id ||
    process.env.NEXT_PUBLIC_PROJECT_ID ||
    "e8b15d20-8012-4eb2-a083-d92ea407c001";

  if (resolvedData.guest?.name) {
    guestName = resolvedData.guest.name;
    hasSpecificGuest = true;
  } else if (queryGuest) {
    guestName = formatFallbackGuestName(queryGuest);
    hasSpecificGuest = true;
  } else if (resolvedParams?.name && resolvedParams.name.length > 0) {
    if (resolvedParams.name[0] === "to" && resolvedParams.name.length > 1) {
      guestName = formatFallbackGuestName(
        resolvedParams.name.slice(1).join(" ")
      );
      hasSpecificGuest = true;
    } else if (resolvedParams.name[0] !== "to") {
      guestName = formatFallbackGuestName(resolvedParams.name.join(" "));
      hasSpecificGuest = true;
    }
  }

  // Load master template
  const templatePath = path.join(
    process.cwd(),
    "public",
    "template_master.html"
  );
  let html = fs.readFileSync(templatePath, "utf8");

  // Injected guest name right above '*Mohon maaf jika ada kesalahan'
  const guestHtml = `<div data-dce-title-color="#FFFFFF" class="elementor-element animated-slow elementor-widget elementor-widget-heading guest-cover-name" style="width: 100% !important; text-align: center !important; margin: 18px auto 6px auto !important; display: block !important;">
  <div class="elementor-widget-container" style="width: 100% !important; text-align: center !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important;">
    <h2 class="elementor-heading-title" style="font-family:'editors-light',Sans-serif;font-size:28px;font-weight:400;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;text-align:center !important;margin:0 auto !important;display:block !important;width:100% !important;">${guestName}</h2>
  </div>
</div>`;

  html = html.replace(
    '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61',
    guestHtml +
      '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61'
  );

  // Auto-fill and lock RSVP author name
  if (hasSpecificGuest) {
    html = html.replace(
      'placeholder="Nama"\nvalue="" />',
      `placeholder="Nama"\nvalue="${guestName}" readonly="readonly" style="background-color: rgba(240, 240, 240, 0.6) !important; cursor: not-allowed !important; color: #333333 !important;" />`
    );
  }

  // Hydrate project data if resolved
  let countdownSec = 1829955600;

  if (project) {
    const brideNick = project.bride_nickname || project.bride_name || "Monica";
    const groomNick = project.groom_nickname || project.groom_name || "Yosua";
    const brideFullName = project.bride_name || brideNick;
    const groomFullName = project.groom_name || groomNick;

    const isBrideFirst = project.project_name
      ? project.project_name
          .toLowerCase()
          .startsWith((project.bride_nickname || "").toLowerCase())
      : true;

    const coupleTitle = isBrideFirst
      ? `${brideNick} & ${groomNick}`
      : `${groomNick} & ${brideNick}`;
    const coupleTitleAmp = isBrideFirst
      ? `${brideNick} &amp; ${groomNick}`
      : `${groomNick} &amp; ${brideNick}`;
    const coupleFullTitle = isBrideFirst
      ? `${brideFullName} & ${groomFullName}`
      : `${groomFullName} & ${brideFullName}`;
    const coupleFullTitleAmp = isBrideFirst
      ? `${brideFullName} &amp; ${groomFullName}`
      : `${groomFullName} &amp; ${brideFullName}`;

    // 1. Title and meta tags
    html = html.replace(
      /The Wedding of Rayhan &amp; Nabila/g,
      `The Wedding of ${coupleTitleAmp}`
    );
    html = html.replace(
      /The Wedding of Rayhan & Nabila/g,
      `The Wedding of ${coupleTitle}`
    );
    html = html.replace(
      /The Wedding of Rayhan Pratama, S\.T\., M\.M\. &amp; Nabila Syakira, S\.E\., M\.B\.A\./g,
      `The Wedding of ${coupleFullTitleAmp}`
    );
    html = html.replace(
      /The Wedding of Rayhan Pratama, S\.T\., M\.M\. & Nabila Syakira, S\.E\., M\.B\.A\./g,
      `The Wedding of ${coupleFullTitle}`
    );

    // 2. Cover / Hero / Footer couple headings
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Rayhan &amp; Nabila<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${coupleTitleAmp}</h2>`
    );
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Rayhan & Nabila<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${coupleTitle}</h2>`
    );

    // 3. Bride card
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Nabila<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${brideNick}</h2>`
    );
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Nabila Syakira, S\.E\., M\.B\.A\.<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${brideFullName}</h2>`
    );

    // Bride parents
    const bF = project.bride_father?.trim();
    const bM = project.bride_mother?.trim();
    let bParents = "";
    if (bF && bM) {
      bParents = `${project.bride_father_deceased ? "(Alm.) Bapak " : "Bapak "}${bF} dan ${project.bride_mother_deceased ? "(Almh.) Ibu " : "Ibu "}${bM}`;
    } else if (bF) {
      bParents = `${project.bride_father_deceased ? "(Alm.) Bapak " : "Bapak "}${bF}`;
    } else if (bM) {
      bParents = `${project.bride_mother_deceased ? "(Almh.) Ibu " : "Ibu "}${bM}`;
    }
    if (bParents) {
      html = html.replace(
        "Bapak Hendra Gunawan dan Ibu Hj. Nurhayati",
        bParents
      );
    }

    // Bride Instagram
    if (project.bride_instagram) {
      const h = project.bride_instagram.replace(/^@/, "").trim();
      html = html.replace(
        /https:\/\/www\.instagram\.com\/nabilasyakira\//g,
        `https://www.instagram.com/${h}/`
      );
      html = html.replace(/@nabilasyakira/g, `@${h}`);
    }

    // 4. Groom card
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Rayhan<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${groomNick}</h2>`
    );
    html = html.replace(
      /<h2 class="elementor-heading-title elementor-size-default">Rayhan Pratama, S\.T\., M\.M\.<\/h2>/g,
      `<h2 class="elementor-heading-title elementor-size-default">${groomFullName}</h2>`
    );

    // Groom parents
    const gF = project.groom_father?.trim();
    const gM = project.groom_mother?.trim();
    let gParents = "";
    if (gF && gM) {
      gParents = `${project.groom_father_deceased ? "(Alm.) Bapak " : "Bapak "}${gF} dan ${project.groom_mother_deceased ? "(Almh.) Ibu " : "Ibu "}${gM}`;
    } else if (gF) {
      gParents = `${project.groom_father_deceased ? "(Alm.) Bapak " : "Bapak "}${gF}`;
    } else if (gM) {
      gParents = `${project.groom_mother_deceased ? "(Almh.) Ibu " : "Ibu "}${gM}`;
    }
    if (gParents) {
      html = html.replace(
        "Bapak Ir. Bambang Pratama, M.Sc. dan Ibu Dra. Hj. Ratna Sari",
        gParents
      );
    }

    // Groom Instagram
    if (project.groom_instagram) {
      const h = project.groom_instagram.replace(/^@/, "").trim();
      html = html.replace(
        /https:\/\/www\.instagram\.com\/rayhanpratama\//g,
        `https://www.instagram.com/${h}/`
      );
      html = html.replace(/@rayhanpratama/g, `@${h}`);
    }

    html = html.replace(/Putri Pertama dari/g, "Putri dari");
    html = html.replace(/Putra Pertama dari/g, "Putra dari");

    // 5. Wedding Date: Cover & Hero
    const wDate =
      project.wedding_date || events[0]?.event_date || "2027-01-09";
    const mainDateParts = parseDateParts(wDate);
    if (mainDateParts) {
      const dotDate = `${mainDateParts.dayDigit} . ${wDate.split("-")[1]} . ${mainDateParts.year}`;
      html = html.replace(/28 \. 12 \. 2027/g, dotDate);
    }

    // 6. Countdown Timer Epoch Target
    const countdownTargetStr =
      project.countdown_target || `${wDate}T09:00:00+07:00`;
    countdownSec =
      Math.floor(new Date(countdownTargetStr).getTime() / 1000) || 1829955600;
    html = html.replace(
      /data-date="1829955600"/g,
      `data-date="${countdownSec}"`
    );

    // 7. Religion & Quotes
    const rel = (project.religion || "").toLowerCase();
    if (rel === "katolik" || rel === "kristen" || rel === "protestan") {
      html = html.replace(
        /<b>Assalamu’alaikum Warahmatullahi Wabarakatuh<\/b><br \/>\s*<br \/>\s*Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan\. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami\./g,
        "<b>Salam Damai Sejahtera dalam Kasih Kristus</b><br /><br />Atas kasih dan kemurahan Tuhan Yang Maha Esa, kami bermaksud mengikat janji suci pernikahan kami dalam ikatan perkawinan yang kudus."
      );
      html = html.replace(
        /<b>Wassalamu’alaikum warahmatullahi wabarakatuh<\/b>/g,
        "<b>Salam hangat dan doa kami, Tuhan Memberkati</b>"
      );
      html = html.replace(
        /"Dan di antara tanda-tanda \(kebesaran\)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang\."/g,
        '"Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia."'
      );
      html = html.replace(/Q\.S Ar-Rum : 21/g, "Matius 19:6");
    }

    // 8. Event 1
    const ev1 = events[0];
    if (ev1) {
      const ev1Label =
        ev1.custom_label ||
        (ev1.event_type === "pemberkatan"
          ? "Pemberkatan Pernikahan"
          : ev1.event_type === "akad"
          ? "Akad Nikah"
          : "Pemberkatan");
      html = html.replace(
        /<h2 class="elementor-heading-title elementor-size-default">Akad Nikah<\/h2>/,
        `<h2 class="elementor-heading-title elementor-size-default">${ev1Label}</h2>`
      );
      const ev1Time = ev1.event_time
        ? ev1.end_time
          ? `${ev1.event_time} - ${ev1.end_time} WIB`
          : `${ev1.event_time} WIB - Selesai`
        : "09:00 - 10:30 WIB";
      html = html.replace(
        /<span class="elementor-icon-list-text">08:00 WIB<\/span>/,
        `<span class="elementor-icon-list-text">${ev1Time}</span>`
      );

      const ev1VenueHtml = `<p class="elementor-heading-title elementor-size-default"><b>${ev1.venue_name}</b><br />\n${ev1.venue_address || ""}</p>`;
      html = html.replace(
        '<p class="elementor-heading-title elementor-size-default"><b>Menara 165</b><br />\nJl. TB Simatupang Jakarta Selatan</p>',
        ev1VenueHtml
      );

      if (ev1.venue_maps_url) {
        html = html.replace(
          'href="https://maps.app.goo.gl/TsZCeupoF4p6bksT6"',
          `href="${ev1.venue_maps_url}"`
        );
      }

      const d1 = parseDateParts(ev1.event_date);
      if (d1) {
        html = html.replace(
          /(data-id="b2cf532"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)28(<\/h2>)/,
          `$1${d1.dayDigit}$2`
        );
        html = html.replace(
          /(data-id="08dd59f"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)Minggu(<\/h2>)/,
          `$1${d1.dayName}$2`
        );
        html = html.replace(
          /(data-id="56ab567"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)Desember(<\/h2>)/,
          `$1${d1.monthName}$2`
        );
        html = html.replace(
          /(data-id="08e54bb"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)2027(<\/h2>)/,
          `$1${d1.year}$2`
        );
      }
    }

    // 9. Event 2
    const ev2 = events[1];
    if (ev2) {
      const ev2Label =
        ev2.custom_label ||
        (ev2.event_type === "resepsi" ? "Resepsi" : ev2.event_type);
      const ev2Time = ev2.event_time
        ? ev2.end_time
          ? `${ev2.event_time} - ${ev2.end_time} WIB`
          : `${ev2.event_time} WIB - Selesai`
        : "13:00 - 15:00 WIB";
      html = html.replace(
        /<span class="elementor-icon-list-text">09:00 - 13:00 WIB<\/span>/,
        `<span class="elementor-icon-list-text">${ev2Time}</span>`
      );

      const ev2VenueHtml = `<p class="elementor-heading-title elementor-size-default"><b>${ev2.venue_name}</b><br />\n${ev2.venue_address || ""}</p>`;
      html = html.replace(
        '<p class="elementor-heading-title elementor-size-default"><b>Menara 165</b><br />\nJl. TB Simatupang Jakarta Selatan</p>',
        ev2VenueHtml
      );

      if (ev2.venue_maps_url) {
        html = html.replace(
          'href="https://maps.app.goo.gl/TsZCeupoF4p6bksT6"',
          `href="${ev2.venue_maps_url}"`
        );
      }

      const d2 = parseDateParts(ev2.event_date);
      if (d2) {
        html = html.replace(
          /(data-id="da41331"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)28(<\/h2>)/,
          `$1${d2.dayDigit}$2`
        );
        html = html.replace(
          /(data-id="212fdac"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)Minggu(<\/h2>)/,
          `$1${d2.dayName}$2`
        );
        html = html.replace(
          /(data-id="5b392e2"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)Desember(<\/h2>)/,
          `$1${d2.monthName}$2`
        );
        html = html.replace(
          /(data-id="ff0fb7a"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">)2027(<\/h2>)/,
          `$1${d2.year}$2`
        );
      }
    }

    // 10. Music
    if (project.music_url) {
      html = html.replace(
        /\/l01-assets\/media\/2024\/06\/McBride-My-Valentine-Martina\.mp3/g,
        project.music_url
      );
    }

    // 11. Google Calendar Link
    const calDates = `${wDate.replace(/-/g, "")}T020000Z%2F${wDate.replace(/-/g, "")}T080000Z`;
    const calText = encodeURIComponent(`The Wedding of ${coupleTitle}`);
    const calDetails = encodeURIComponent(
      `The Wedding of ${coupleTitle}\n${coupleFullTitle}`
    );
    html = html.replace(
      /href="https:\/\/www\.google\.com\/calendar\/render\?action=TEMPLATE[^"]*"/g,
      `href="https://www.google.com/calendar/render?action=TEMPLATE&amp;text=${calText}&amp;details=${calDetails}&amp;dates=${calDates}"`
    );

    // 12. Cashless / Wedding Gift section
    const hasCashless = !!project.has_cashless;
    const paymentAccounts = (Array.isArray(project.payment_accounts)
      ? project.payment_accounts
      : []) as {
      bank_name?: string;
      account_number?: string;
      account_name?: string;
    }[];

    if (!hasCashless && paymentAccounts.length === 0) {
      html = html.replace(
        "</head>",
        "<style>.elementor-element-6e59bcc, #btn_gift, #sec_gift { display: none !important; }</style></head>"
      );
    } else {
      html = html.replace(/>Rayhan Pratama<\/div>/g, `>${groomFullName}</div>`);
      html = html.replace(/>Nabila Syakira<\/div>/g, `>${brideFullName}</div>`);
      html = html.replace(
        />Rayhan Pratama \/ Nabila Syakira<\/div>/g,
        `>${coupleFullTitle}</div>`
      );
    }
  }

  // Inject client-side scripts: RSVP locking & submission, countdown runner, and layout fixes
  const clientScript = `
<style>
.guest-cover-name, .guest-cover-name * {
  text-align: center !important;
  margin-left: auto !important;
  margin-right: auto !important;
  justify-content: center !important;
}
#author[readonly] {
  background-color: rgba(240, 240, 240, 0.7) !important;
  cursor: not-allowed !important;
  user-select: none !important;
}
#saic-comment-status-29862:empty,
.saic-loading:empty,
.wdsfa-rsvp-infinite,
.saico-loading:not(.show-spinner) {
  display: none !important;
}


/* Keep cover left column completely transparent so the hero desktop panel (848e89d) is fully visible */
.elementor-element-52f6b538,
.elementor-element-52f6b538 > .elementor-widget-wrap,
.elementor-element-52f6b538 > .elementor-element-populated,
.elementor-element-52f6b538 .elementor-background-overlay,
.elementor-element-52f6b538 > .elementor-element-populated > .elementor-background-overlay {
  background: transparent !important;
  background-image: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Hero Left desktop section (contains couple photo + video leak + wedding typography) */
.elementor-element-848e89d,
.elementor-element-848e89d .elementor-background-slideshow__slide__image,
.elementor-element-848e89d > .elementor-widget-wrap,
.elementor-element-848e89d > .elementor-element-populated,
#cover_desktop {
  background-image: url('/l01-assets/media/jet-form-builder/695b3bdcd89a6aa8982774659196c290/2025/01/0-PEMBUKA.jpg') !important;
  background-position: center 20% !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
}

@media screen and (min-width: 1200px) {
  .elementor-element-848e89d,
  .elementor-element-848e89d .elementor-background-slideshow__slide__image {
    background-position: center 18% !important;
  }
}

@media screen and (min-aspect-ratio: 16/9), screen and (min-width: 1600px) {
  .elementor-element-848e89d,
  .elementor-element-848e89d .elementor-background-slideshow__slide__image {
    background-position: center 15% !important;
  }
}

@media screen and (min-aspect-ratio: 21/9), screen and (min-width: 2200px) {
  .elementor-element-848e89d,
  .elementor-element-848e89d .elementor-background-slideshow__slide__image {
    background-position: center 12% !important;
  }
}

@media screen and (max-height: 800px) and (min-width: 1024px) {
  .elementor-element-848e89d,
  .elementor-element-848e89d .elementor-background-slideshow__slide__image {
    background-position: center 15% !important;
  }
}

/* Background Slideshow System */
.sera-bg-slideshow {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  z-index: 0 !important;
  pointer-events: none !important;
}
.sera-bg-slide {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 1.8s ease-in-out, transform 6.5s ease-out !important;
  will-change: opacity, transform;
}
.sera-bg-slide.active {
  opacity: 1 !important;
  transform: scale(1.10) !important;
}

/* Section bb53199 (Closing - Terima Kasih) */
.elementor-element-bb53199 {
  position: relative !important;
  overflow: hidden !important;
}
.elementor-element-bb53199 > .elementor-background-overlay {
  opacity: 0.35 !important;
  background-color: #000000 !important;
  z-index: 1 !important;
  position: absolute !important;
  inset: 0 !important;
}
.elementor-element-bb53199 > .elementor-container {
  position: relative !important;
  z-index: 2 !important;
}
.elementor-element-61d70535 {
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 100%) !important;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 100%) !important;
  pointer-events: none !important;
}

/* Section 20bc11e (Save The Date) */
.elementor-element-20bc11e {
  position: relative !important;
  overflow: hidden !important;
}
.elementor-element-20bc11e > .elementor-background-overlay {
  opacity: 0.45 !important;
  background-color: #000000 !important;
  z-index: 1 !important;
  position: absolute !important;
  inset: 0 !important;
}
.elementor-element-20bc11e > .elementor-container {
  position: relative !important;
  z-index: 2 !important;
}
</style>
<script>
window.copyGiftText = function(text, btnElement, successText) {
  function showCopied() {
    if (!btnElement) return;
    var origHtml = btnElement.getAttribute("data-orig-html");
    if (!origHtml) {
      origHtml = btnElement.innerHTML;
      btnElement.setAttribute("data-orig-html", origHtml);
    }
    btnElement.innerHTML = '<svg style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.5;display:inline-block;vertical-align:middle;margin-right:4px;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg><span>' + (successText || 'Tersalin!') + '</span>';
    btnElement.classList.add('copied');
    setTimeout(function() {
      btnElement.innerHTML = origHtml;
      btnElement.classList.remove('copied');
    }, 2500);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(showCopied).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }

  function fallbackCopy(val) {
    var ta = document.createElement("textarea");
    ta.value = val;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showCopied();
    } catch (e) {
      prompt("Salin teks berikut:", val);
    }
    document.body.removeChild(ta);
  }
};
(function() {
  
  // Left section responsive framing runner
  function applyLeftSectionFraming() {
    var ratio = window.innerWidth / (window.innerHeight || 1);
    var isUltrawide = window.innerWidth >= 2200 || ratio >= 2.2;
    var isWide = window.innerWidth >= 1600 || ratio >= 1.7;
    var isShort = window.innerHeight <= 800 && window.innerWidth >= 1024;
    var pos = isUltrawide ? "center 12%" : (isWide || isShort ? "center 15%" : (window.innerWidth >= 1200 ? "center 18%" : "center 20%"));
    
    // Only target 848e89d, NOT 52f6b538!
    var leftEls = document.querySelectorAll(
      ".elementor-element-848e89d, .elementor-element-848e89d .elementor-background-slideshow__slide__image"
    );
    leftEls.forEach(function(el) {
      el.style.setProperty("background-position", pos, "important");
      el.style.setProperty("background-size", "cover", "important");
    });

    // Ensure 52f6b538 is always completely transparent so 848e89d shows through
    var coverLeft = document.querySelector(".elementor-element-52f6b538");
    if (coverLeft) {
      coverLeft.style.setProperty("background", "transparent", "important");
      coverLeft.style.setProperty("background-image", "none", "important");
      var overlay = coverLeft.querySelector(".elementor-background-overlay");
      if (overlay) overlay.style.setProperty("display", "none", "important");
    }
  }
  window.addEventListener("resize", applyLeftSectionFraming);
  applyLeftSectionFraming();
  setTimeout(applyLeftSectionFraming, 100);
  setTimeout(applyLeftSectionFraming, 500);
  setTimeout(applyLeftSectionFraming, 1500);

  // 1. Countdown runner (Populates Hari, Jam, Menit, Detik on Cover & Save The Date)
  function runCountdowns() {
    var wrappers = document.querySelectorAll(".elementor-countdown-wrapper");
    var targetSec = ${countdownSec};
    var nowSec = Math.floor(Date.now() / 1000);
    var diff = Math.max(0, targetSec - nowSec);
    var days = Math.floor(diff / (24 * 3600));
    var hours = Math.floor((diff % (24 * 3600)) / 3600);
    var minutes = Math.floor((diff % 3600) / 60);
    var seconds = Math.floor(diff % 60);

    var pad = function(num) {
      return num < 10 ? "0" + num : String(num);
    };

    wrappers.forEach(function(wrap) {
      var dEl = wrap.querySelector(".elementor-countdown-days");
      var hEl = wrap.querySelector(".elementor-countdown-hours");
      var mEl = wrap.querySelector(".elementor-countdown-minutes");
      var sEl = wrap.querySelector(".elementor-countdown-seconds");

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);
    });
  }

  // 2. RSVP sync & lock
  function syncRsvpGuest() {
    var guest = ${JSON.stringify(hasSpecificGuest ? guestName : "")};
    var authorInput = document.getElementById("author") || document.querySelector('input[name="author"]');
    if (authorInput && guest) {
      authorInput.value = guest;
      authorInput.readOnly = true;
      authorInput.setAttribute("readonly", "readonly");
      authorInput.style.cursor = "not-allowed";
      authorInput.style.backgroundColor = "rgba(240, 240, 240, 0.7)";
    }

    var guestSelect = document.getElementById("guest") || document.querySelector('select[name="guest"]');
    if (guestSelect) {
      if (guestSelect.options.length < 4) {
        guestSelect.innerHTML = '<option value="1" selected>1 Orang</option><option value="2">2 Orang</option><option value="3">3 Orang</option><option value="4">4 Orang</option>';
      }
    }
    if (typeof WDS_RSVP !== "undefined") {
      WDS_RSVP.guestMax = "4";
    }

    // Attach custom AJAX submit handler to prevent endless spinner
    var rsvpForm = document.getElementById("commentform-29862");
    if (rsvpForm && !rsvpForm.__serastoryHandled) {
      rsvpForm.__serastoryHandled = true;
      rsvpForm.addEventListener("submit", async function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var submitBtn = document.getElementById("submit-29862");
        var authorEl = document.getElementById("author") || rsvpForm.querySelector('[name="author"]');
        var textareaEl = document.getElementById("saic-textarea-29862") || rsvpForm.querySelector('[name="comment"]');
        var attendanceEl = document.getElementById("attendance") || rsvpForm.querySelector('[name="attendance"]');
        var guestEl = document.getElementById("guest") || rsvpForm.querySelector('[name="guest"]');
        var statusEl = document.getElementById("saic-comment-status-29862");

        var nameVal = (authorEl ? authorEl.value : "").trim() || guest || "Tamu Undangan";
        var messageVal = (textareaEl ? textareaEl.value : "").trim();
        var attendVal = (attendanceEl ? attendanceEl.value : "present");
        var paxVal = (guestEl ? guestEl.value : "1");

        if (!messageVal || messageVal.length < 2) {
          alert("Mohon isi ucapan terlebih dahulu (minimal 2 karakter).");
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.value = "Mengirim...";
        }

        try {
          await fetch("/api/rsvp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              project_id: ${JSON.stringify(projectId)},
              guest_name: nameVal,
              attendance: attendVal,
              pax: parseInt(paxVal, 10) || 1,
              message: messageVal
            })
          });

          await fetch("/api/wishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              project_id: ${JSON.stringify(projectId)},
              name: nameVal,
              message: messageVal
            })
          });

          if (textareaEl) textareaEl.value = "";
          if (submitBtn) {
            submitBtn.value = "Terkirim ✓";
          }

          if (statusEl) {
            statusEl.innerHTML = '<div style="padding: 14px 18px; margin: 15px 0; background: #e8f5e9; color: #1b5e20; border-radius: 8px; font-weight: 600; text-align: center; border: 1px solid #c8e6c9;">✓ Terima kasih atas konfirmasi kehadiran dan doa restu Anda!</div>';
            statusEl.style.display = "block";
          }
        } catch (err) {
          console.error("RSVP submit error:", err);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = "Kirim";
          }
          alert("Konfirmasi Anda berhasil dicatat. Terima kasih!");
        }
      }, true);
    }
  }

  // 3. Background Slideshow runner
  function runBackgroundSlideshows() {
    var slideshows = document.querySelectorAll(".sera-bg-slideshow");
    slideshows.forEach(function(wrap) {
      if (wrap.__seraTimer) return;
      var slides = wrap.querySelectorAll(".sera-bg-slide");
      if (slides.length <= 1) return;
      var idx = 0;
      wrap.__seraTimer = setInterval(function() {
        slides[idx].classList.remove("active");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("active");
      }, 4000);
    });
  }

  runCountdowns();
  runBackgroundSlideshows();
  setInterval(runCountdowns, 1000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      runCountdowns();
      runBackgroundSlideshows();
      syncRsvpGuest();
    });
  } else {
    runCountdowns();
    runBackgroundSlideshows();
    syncRsvpGuest();
  }
  setTimeout(function() { runCountdowns(); runBackgroundSlideshows(); syncRsvpGuest(); }, 300);
  setTimeout(function() { runCountdowns(); runBackgroundSlideshows(); syncRsvpGuest(); }, 1000);
  setTimeout(function() { runCountdowns(); runBackgroundSlideshows(); syncRsvpGuest(); }, 2500);
})();
</script>
</body>`;

  html = html.replace("</body>", clientScript);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
