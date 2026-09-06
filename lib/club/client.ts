"use client";

import type { ClubState, Discount, PayMethod, Staff } from "./types";

export async function fetchClub(): Promise<ClubState> {
  const response = await fetch("/api/club", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load POS Club");
  return (await response.json()) as ClubState;
}

export async function act(body: Record<string, unknown>): Promise<{
  state: ClubState;
  user?: Staff;
  orderId?: string;
  error?: string;
}> {
  const response = await fetch("/api/club", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as {
    state?: ClubState;
    user?: Staff;
    order?: { id: string };
    error?: string;
  };
  if (!response.ok || !data.state) {
    throw new Error(data.error || "POS action failed");
  }
  return { state: data.state, user: data.user, orderId: data.order?.id };
}

export async function login(pin: string) {
  return act({ type: "login", pin });
}

export async function openOrder(payload: {
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  serverId: string;
  asTab?: boolean;
}) {
  return act({ type: "open", ...payload });
}

export async function addItem(orderId: string, productId: string, note?: string) {
  return act({ type: "add", orderId, productId, note });
}

export async function changeQty(orderId: string, lineId: string, delta: number) {
  return act({ type: "qty", orderId, lineId, delta });
}

export async function voidItem(orderId: string, lineId: string) {
  return act({ type: "void-item", orderId, lineId });
}

export async function voidOrder(orderId: string) {
  return act({ type: "void-order", orderId });
}

export async function holdOrder(orderId: string) {
  return act({ type: "hold", orderId });
}

export async function sendOrder(orderId: string) {
  return act({ type: "send", orderId });
}

export async function setTicket(
  orderId: string,
  ticketStatus: "new" | "preparing" | "ready" | "served",
) {
  return act({ type: "ticket", orderId, ticketStatus });
}

export async function applyDiscount(orderId: string, discount: Discount) {
  return act({ type: "discount", orderId, discount });
}

export async function setNote(orderId: string, lineId: string, note: string) {
  return act({ type: "note", orderId, lineId, note });
}

export async function transferOrder(orderId: string, tableId: string) {
  return act({ type: "transfer", orderId, tableId });
}

export async function mergeOrders(fromId: string, intoId: string) {
  return act({ type: "merge", fromId, intoId });
}

export async function payOrder(orderId: string, method: PayMethod, amount: number) {
  return act({ type: "pay", orderId, method, amount });
}

export async function reserveTable(tableId: string) {
  return act({ type: "reserve", tableId });
}

export async function adjustStock(
  ingredientId: string,
  qty: number,
  kind: "in" | "waste" | "adjust",
  note: string,
) {
  return act({ type: "stock", ingredientId, qty, kind, note });
}
