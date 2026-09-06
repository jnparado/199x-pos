import {
  addItem,
  adjustIngredient,
  applyDiscount,
  changeQty,
  getState,
  holdOrder,
  login,
  mergeOrders,
  openOrder,
  payOrder,
  reserveTable,
  resetClub,
  sendOrder,
  setNote,
  setTicket,
  transferOrder,
  voidItem,
  voidOrder,
} from "@/lib/club/store";
import { corsHeaders, withCors } from "@/lib/club/cors";
import type { Discount, PayMethod } from "@/lib/club/types";

type Action =
  | { type: "login"; pin: string }
  | {
      type: "open";
      tableId?: string;
      customerName?: string;
      customerPhone?: string;
      serverId: string;
      asTab?: boolean;
    }
  | { type: "add"; orderId: string; productId: string; note?: string }
  | { type: "qty"; orderId: string; lineId: string; delta: number }
  | { type: "void-item"; orderId: string; lineId: string }
  | { type: "void-order"; orderId: string }
  | { type: "hold"; orderId: string }
  | { type: "send"; orderId: string }
  | { type: "ticket"; orderId: string; ticketStatus: "new" | "preparing" | "ready" | "served" }
  | { type: "discount"; orderId: string; discount: Discount }
  | { type: "note"; orderId: string; lineId: string; note: string }
  | { type: "transfer"; orderId: string; tableId: string }
  | { type: "merge"; fromId: string; intoId: string }
  | { type: "pay"; orderId: string; method: PayMethod; amount: number }
  | { type: "reserve"; tableId: string }
  | { type: "stock"; ingredientId: string; qty: number; kind: "in" | "waste" | "adjust"; note: string }
  | { type: "reset" };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function json(data: unknown, status = 200) {
  return withCors(Response.json(data, { status }));
}

export async function GET() {
  return json(getState());
}

export async function POST(request: Request) {
  const action = (await request.json()) as Action;
  try {
    switch (action.type) {
      case "login":
        return json({ user: login(action.pin), state: getState() });
      case "open":
        return json({
          order: openOrder(action),
          state: getState(),
        });
      case "add":
        return json({
          order: addItem(action.orderId, action.productId, action.note),
          state: getState(),
        });
      case "qty":
        return json({
          order: changeQty(action.orderId, action.lineId, action.delta),
          state: getState(),
        });
      case "void-item":
        return json({
          order: voidItem(action.orderId, action.lineId),
          state: getState(),
        });
      case "void-order":
        return json({
          order: voidOrder(action.orderId),
          state: getState(),
        });
      case "hold":
        return json({
          order: holdOrder(action.orderId),
          state: getState(),
        });
      case "send":
        return json({
          order: sendOrder(action.orderId),
          state: getState(),
        });
      case "ticket":
        return json({
          order: setTicket(action.orderId, action.ticketStatus),
          state: getState(),
        });
      case "discount":
        return json({
          order: applyDiscount(action.orderId, action.discount),
          state: getState(),
        });
      case "note":
        return json({
          order: setNote(action.orderId, action.lineId, action.note),
          state: getState(),
        });
      case "transfer":
        return json({
          order: transferOrder(action.orderId, action.tableId),
          state: getState(),
        });
      case "merge":
        return json({
          order: mergeOrders(action.fromId, action.intoId),
          state: getState(),
        });
      case "pay":
        return json({
          order: payOrder(action.orderId, action.method, action.amount),
          state: getState(),
        });
      case "reserve":
        return json({
          table: reserveTable(action.tableId),
          state: getState(),
        });
      case "stock":
        return json({
          ingredient: adjustIngredient(
            action.ingredientId,
            action.qty,
            action.kind,
            action.note,
          ),
          state: getState(),
        });
      case "reset":
        return json({ state: resetClub() });
      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Action failed" },
      400,
    );
  }
}
