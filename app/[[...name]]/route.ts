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
  const queryGuest =
    searchParams.get("to") ||
    searchParams.get("guest") ||
    searchParams.get("u") ||
    searchParams.get("n");

  if (queryGuest) {
    guestName = formatFallbackGuestName(queryGuest);
  } else if (resolvedParams?.name && resolvedParams.name.length > 0) {
    guestName = formatFallbackGuestName(resolvedParams.name.join(" "));
  }

  // Load master template
  const templatePath = path.join(process.cwd(), "public", "template_master.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // Inject guest name right above '*Mohon maaf jika ada kesalahan'
  const guestHtml = `<div data-dce-title-color="#FFFFFF" class="elementor-element animated-slow elementor-widget elementor-widget-heading" style="margin: 15px 0 5px 0;"><div class="elementor-widget-container"><h2 class="elementor-heading-title" style="font-family:'editors-light',Sans-serif;font-size:26px;font-weight:400;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;margin:0;">${guestName}</h2></div></div>`;

  html = html.replace(
    '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61',
    guestHtml + '<div data-dce-title-color="#FFFFFF" class="elementor-element elementor-element-e4ffb61'
  );

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
