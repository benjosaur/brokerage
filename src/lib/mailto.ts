import type { MicroProvider, SupportRequest } from "./types";

/**
 * Draft an email to a micro-provider about a request. Deliberately contains
 * no personal contact details — like WCN's real process, only the
 * non-personal request summary is shared, and replies go via WCN.
 */
export function buildMailto(
  provider: MicroProvider,
  request: SupportRequest,
): string {
  const firstName = provider.name.split(" ")[0];
  const subject = `New support request via Wells Community Network — ${request.headline}`;
  const lines = [
    `Hello ${firstName},`,
    "",
    "A request for support has come through the Wells Community Network brokerage tool that matches your profile:",
    "",
    `"${request.headline}"`,
    "",
    `Area: ${request.locality}`,
    `Support needed: ${request.services.join(", ") || "General support — see request"}`,
    `Days and times: ${request.schedule}`,
  ];
  if (request.hasPets) {
    lines.push(`Pets in the home: ${request.petDetails || "yes"}`);
  }
  lines.push(
    "",
    "If you are available and interested, please reply to Wells Community Network and we will take it from there. Contact details are only shared once both sides are happy to proceed.",
    "",
    "Wells Community Network",
    "wcnmicroproviders@gmail.com · 01749 467079",
  );
  const params = new URLSearchParams({
    subject,
    body: lines.join("\n"),
  });
  // URLSearchParams encodes spaces as "+", which mail clients render
  // literally; percent-encoding keeps the draft readable.
  return `mailto:${provider.email}?${params.toString().replaceAll("+", "%20")}`;
}
