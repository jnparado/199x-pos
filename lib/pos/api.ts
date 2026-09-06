import type {
  CatalogResponse,
  PayPayload,
  PosConnection,
  Ticket,
  TicketPayload,
} from "../types";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`POS request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export function fetchCatalog() {
  return fetch("/api/pos/catalog").then((res) => readJson<CatalogResponse>(res));
}

export function fetchHealth() {
  return fetch("/api/pos/health").then((res) => readJson<PosConnection>(res));
}

export function fetchTickets() {
  return fetch("/api/pos/tickets").then((res) =>
    readJson<{ tickets: Ticket[] }>(res),
  );
}

export function createTicket(payload: TicketPayload) {
  return fetch("/api/pos/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => readJson<{ ticket: Ticket }>(res));
}

export function saveTicket(ticket: Ticket) {
  return fetch("/api/pos/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  }).then((res) => readJson<{ ticket: Ticket }>(res));
}

export function updateTicket(id: string, patch: Partial<Ticket>) {
  return fetch(`/api/pos/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((res) => readJson<{ ticket: Ticket }>(res));
}

export function payTicket(id: string, payload: PayPayload) {
  return fetch(`/api/pos/tickets/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => readJson<{ ticket: Ticket }>(res));
}

export function syncExistingPos() {
  return fetch("/api/pos/sync", { method: "POST" }).then((res) =>
    readJson<{
      connection: PosConnection;
      itemCount: number;
      remoteTicketCount: number;
    }>(res),
  );
}
