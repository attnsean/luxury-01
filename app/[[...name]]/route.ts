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
  // Perfectly centered with text-align: center and margin: 0 auto
  const guestHtml = `<div data-dce-title-color="#FFFFFF" class="elementor-element animated-slow elementor-widget elementor-widget-heading guest-cover-name" style="width: 100% !important; text-align: center !important; margin: 18px auto 6px auto !important; display: block !important;">
  <div class="elementor-widget-container" style="width: 100% !important; text-align: center !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important;">
    <h2 class="elementor-heading-title" style="font-family:'editors-light',Sans-serif;font-size:28px;font-weight:400;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;text-align:center !important;margin:0 auto !important;display:block !important;width:100% !important;">${guestName}</h2>
  </div>
</div>`;

  html = html.replace(
    '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61',
    guestHtml + '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61'
  );

  // Auto-fill RSVP author name if specific guest is provided
  if (hasSpecificGuest) {
    html = html.replace(
      'placeholder="Nama"\nvalue="" />',
      `placeholder="Nama"\nvalue="${guestName}" />`
    );
  }

  // Inject centering style and client-side RSVP sync script before </body>
  const clientScript = `
<style>
.guest-cover-name, .guest-cover-name * {
  text-align: center !important;
  margin-left: auto !important;
  margin-right: auto !important;
  justify-content: center !important;
}
</style>
<script>
(function() {
  function syncRsvpGuest() {
    var guest = ${JSON.stringify(hasSpecificGuest ? guestName : "")};
    var authorInput = document.getElementById("author") || document.querySelector('input[name="author"]');
    if (authorInput && guest) {
      if (!authorInput.value || authorInput.value === "" || authorInput.value === "Tamu Undangan") {
        authorInput.value = guest;
      }
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
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncRsvpGuest);
  } else {
    syncRsvpGuest();
  }
  setTimeout(syncRsvpGuest, 300);
  setTimeout(syncRsvpGuest, 1000);
  setTimeout(syncRsvpGuest, 2500);
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
