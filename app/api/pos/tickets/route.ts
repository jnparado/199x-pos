import { createTicket, getBarStore, listTickets } from "@/lib/pos/store";
import { pushTicket } from "@/lib/pos/client";
import type { Ticket, TicketPayload } from "@/lib/types";

export async function GET() {
  return Response.json({ tickets: listTickets(getBarStore()) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as TicketPayload | Ticket;

  if ("id" in body && "lines" in body) {
    const ticket = await pushTicket(body);
    return Response.json({ ticket });
  }

  const ticket = createTicket(getBarStore(), body);
  return Response.json({ ticket }, { status: 201 });
}
