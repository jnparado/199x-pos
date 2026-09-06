import { getMergedCatalog, pullRemoteTickets } from "@/lib/pos/client";

export async function POST() {
  const catalog = await getMergedCatalog();
  const remoteTickets = await pullRemoteTickets();
  return Response.json({
    connection: catalog.connection,
    itemCount: catalog.items.length,
    remoteTicketCount: remoteTickets.length,
  });
}
