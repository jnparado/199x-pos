import { getApiUrl } from "./config";
import type { ClubState, Discount, PayMethod, Staff } from "./types";

type ActResult = {
  state: ClubState;
  user?: Staff;
  orderId?: string;
};

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = (await response.json()) as {
    state?: ClubState;
    user?: Staff;
    order?: { id: string };
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error || "POS request failed");
  }
  return data;
}

export async function fetchClub(): Promise<ClubState> {
  const response = await fetch(`${getApiUrl()}/api/club`);
  if (!response.ok) throw new Error("Failed to load 199X POS");
  return (await response.json()) as ClubState;
}

export async function act(body: Record<string, unknown>): Promise<ActResult> {
  const data = await request("/api/club", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!data.state) throw new Error(data.error || "POS action failed");
  return { state: data.state, user: data.user, orderId: data.order?.id };
}

export const login = (pin: string) => act({ type: "login", pin });
export const openOrder = (payload: {
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  serverId: string;
  asTab?: boolean;
}) => act({ type: "open", ...payload });
export const addItem = (orderId: string, productId: string) =>
  act({ type: "add", orderId, productId });
export const changeQty = (orderId: string, lineId: string, delta: number) =>
  act({ type: "qty", orderId, lineId, delta });
export const voidItem = (orderId: string, lineId: string) =>
  act({ type: "void-item", orderId, lineId });
export const voidOrder = (orderId: string) => act({ type: "void-order", orderId });
export const holdOrder = (orderId: string) => act({ type: "hold", orderId });
export const sendOrder = (orderId: string) => act({ type: "send", orderId });
export const setTicket = (orderId: string, ticketStatus: string) =>
  act({ type: "ticket", orderId, ticketStatus });
export const applyDiscount = (orderId: string, discount: Discount) =>
  act({ type: "discount", orderId, discount });
export const payOrder = (orderId: string, method: PayMethod, amount: number) =>
  act({ type: "pay", orderId, method, amount });
export const reserveTable = (tableId: string) => act({ type: "reserve", tableId });
