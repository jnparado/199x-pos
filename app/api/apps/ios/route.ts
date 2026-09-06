import { readFileSync } from "node:fs";
import path from "node:path";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const icon = readFileSync(path.join(process.cwd(), "public", "apple-touch-icon.png"));
  const iconData = icon.toString("base64").replace(/\s+/g, "");
  const appUrl = `${origin}/login`;

  const profile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>Icon</key>
      <data>${iconData}</data>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>199X POS</string>
      <key>PayloadDescription</key>
      <string>Adds 199X Kadayawan POS to the Home Screen</string>
      <key>PayloadDisplayName</key>
      <string>199X Kadayawan POS</string>
      <key>PayloadIdentifier</key>
      <string>ph.kadayawan.199x.webclip</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>8f3c1a2e-4c06-4ada-9a02-199020260002</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${appUrl}</string>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>199X Kadayawan POS</string>
  <key>PayloadIdentifier</key>
  <string>ph.kadayawan.199x</string>
  <key>PayloadOrganization</key>
  <string>199X Kadayawan</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>8f3c1a2e-4c06-4ada-9a02-199020260001</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  return new Response(profile, {
    headers: {
      "Content-Type": "application/x-apple-aspen-config; charset=utf-8",
      "Content-Disposition": 'attachment; filename="199X-Kadayawan-POS.mobileconfig"',
      "Cache-Control": "no-store",
    },
  });
}
