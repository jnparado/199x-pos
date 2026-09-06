import { applyPayment, getBarStore, getTicket, upsertTicket } from "@/lib/pos/store";
import { pushTicket } from "@/lib/pos/client";
import type { PayPayload, Ticket } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const ticket = getTicket(getBarStore(), id);
  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }
  return Response.json({ ticket });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = getTicket(getBarStore(), id);
  if (!existing) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const body = (await request.json()) as Partial<Ticket>;
  const ticket = upsertTicket(getBarStore(), { ...existing, ...body, id });
  return Response.json({ ticket });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as PayPayload;
  try {
    const paid = applyPayment(getBarStore(), id, body);
    const ticket = await pushTicket(paid);
    return Response.json({ ticket });
  } catch {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }
}
