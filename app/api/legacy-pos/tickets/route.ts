import { getLegacyStore, listTickets, upsertTicket } from "@/lib/pos/store";
import type { Ticket } from "@/lib/types";

export async function GET() {
  return Response.json({ tickets: listTickets(getLegacyStore()) });
}

export async function POST(request: Request) {
  const ticket = (await request.json()) as Ticket;
  const saved = upsertTicket(getLegacyStore(), {
    ...ticket,
    syncedToExisting: true,
  });
  return Response.json({ ticket: saved });
}
