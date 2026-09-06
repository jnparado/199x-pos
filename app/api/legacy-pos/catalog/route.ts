import { legacyCatalog } from "@/lib/pos/store";

export async function GET() {
  return Response.json({ items: legacyCatalog() });
}
