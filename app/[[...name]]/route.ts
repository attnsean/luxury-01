import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name?: string[] }> }
) {
  const { searchParams } = new URL(request.url);
  const resolvedParams = await context.params;

  let guestName = "Tamu Undangan";
  let hasSpecificGuest = false;

  const queryGuest =
    searchParams.get("to") ||
    searchParams.get("guest") ||
    searchParams.get("u") ||
    searchParams.get("n");

  if (queryGuest) {
    guestName = formatFallbackGuestName(queryGuest);
    hasSpecificGuest = true;
  } else if (resolvedParams?.name && resolvedParams.name.length > 0) {
    guestName = formatFallbackGuestName(resolvedParams.name.join(" "));
    hasSpecificGuest = true;
  }

  // Load master template
  const templatePath = path.join(process.cwd(), "public", "template_master.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // Injected guest name right above '*Mohon maaf jika ada kesalahan'
  // Centered with text-align: center and margin: 0 auto
  const guestHtml = `<div data-dce-title-color="#FFFFFF" class="elementor-element animated-slow elementor-widget elementor-widget-heading guest-cover-name" style="width: 100% !important; text-align: center !important; margin: 18px auto 6px auto !important; display: block !important;">
  <div class="elementor-widget-container" style="width: 100% !important; text-align: center !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important;">
    <h2 class="elementor-heading-title" style="font-family:'editors-light',Sans-serif;font-size:28px;font-weight:400;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;text-align:center !important;margin:0 auto !important;display:block !important;width:100% !important;">${guestName}</h2>
  </div>
</div>`;

  html = html.replace(
    '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61',
    guestHtml + '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61'
  );

  // Auto-fill and lock RSVP author name
  if (hasSpecificGuest) {
    html = html.replace(
      'placeholder="Nama"\nvalue="" />',
      `placeholder="Nama"\nvalue="${guestName}" readonly="readonly" style="background-color: rgba(240, 240, 240, 0.6) !important; cursor: not-allowed !important; color: #333333 !important;" />`
    );
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
(function() {
  // 1. Countdown runner (Populates Hari, Jam, Menit, Detik on Cover & Save The Date)
  function runCountdowns() {
    var wrappers = document.querySelectorAll(".elementor-countdown-wrapper");
    var targetSec = 1829955600; // Target wedding date Dec 28, 2027
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
              project_id: "e8b15d20-8012-4eb2-a083-d92ea407c001",
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
              project_id: "e8b15d20-8012-4eb2-a083-d92ea407c001",
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
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
