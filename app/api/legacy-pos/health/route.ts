import { getPosConfig } from "@/lib/pos/config";

export async function GET() {
  const config = getPosConfig();
  return Response.json({
    ok: true,
    venue: `${config.venueName} legacy POS`,
    provider: "C-Lab existing register",
  });
}
