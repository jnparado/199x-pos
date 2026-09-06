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

export async function GET() {
  return Response.json(getState());
}

export async function POST(request: Request) {
  const action = (await request.json()) as Action;
  try {
    switch (action.type) {
      case "login":
        return Response.json({ user: login(action.pin), state: getState() });
      case "open":
        return Response.json({
          order: openOrder(action),
          state: getState(),
        });
      case "add":
        return Response.json({
          order: addItem(action.orderId, action.productId, action.note),
          state: getState(),
        });
      case "qty":
        return Response.json({
          order: changeQty(action.orderId, action.lineId, action.delta),
          state: getState(),
        });
      case "void-item":
        return Response.json({
          order: voidItem(action.orderId, action.lineId),
          state: getState(),
        });
      case "void-order":
        return Response.json({
          order: voidOrder(action.orderId),
          state: getState(),
        });
      case "hold":
        return Response.json({
          order: holdOrder(action.orderId),
          state: getState(),
        });
      case "send":
        return Response.json({
          order: sendOrder(action.orderId),
          state: getState(),
        });
      case "ticket":
        return Response.json({
          order: setTicket(action.orderId, action.ticketStatus),
          state: getState(),
        });
      case "discount":
        return Response.json({
          order: applyDiscount(action.orderId, action.discount),
          state: getState(),
        });
      case "note":
        return Response.json({
          order: setNote(action.orderId, action.lineId, action.note),
          state: getState(),
        });
      case "transfer":
        return Response.json({
          order: transferOrder(action.orderId, action.tableId),
          state: getState(),
        });
      case "merge":
        return Response.json({
          order: mergeOrders(action.fromId, action.intoId),
          state: getState(),
        });
      case "pay":
        return Response.json({
          order: payOrder(action.orderId, action.method, action.amount),
          state: getState(),
        });
      case "reserve":
        return Response.json({
          table: reserveTable(action.tableId),
          state: getState(),
        });
      case "stock":
        return Response.json({
          ingredient: adjustIngredient(
            action.ingredientId,
            action.qty,
            action.kind,
            action.note,
          ),
          state: getState(),
        });
      case "reset":
        return Response.json({ state: resetClub() });
      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Action failed" },
      { status: 400 },
    );
  }
}
