import { getMergedCatalog } from "@/lib/pos/client";

export async function GET() {
  const catalog = await getMergedCatalog();
  return Response.json(catalog);
}
