import { checkExistingPos } from "@/lib/pos/client";

export async function GET() {
  const connection = await checkExistingPos();
  return Response.json(connection);
}
