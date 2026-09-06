import { LOCAL_CATALOG, EXISTING_POS_EXTRAS } from "../catalog";
import { newId, nowIso, paidTotal, taxOn, ticketSubtotal } from "../format";
import type { MenuItem, PayPayload, Ticket, TicketPayload } from "../types";
import { loadPersisted, savePersisted, type PersistedSlice } from "./persist";

type MemoryStore = {
  tickets: Map<string, Ticket>;
  nextNumber: number;
};

const globalStore = globalThis as typeof globalThis & {
  __clabPosStore?: MemoryStore;
  __clabLegacyStore?: MemoryStore;
};

function sliceFromStore(store: MemoryStore): PersistedSlice {
  return {
    tickets: [...store.tickets.values()],
    nextNumber: store.nextNumber,
  };
}

function storeFromSlice(slice?: PersistedSlice): MemoryStore {
  if (!slice) {
    return { tickets: new Map(), nextNumber: 1042 };
  }
  return {
    tickets: new Map(slice.tickets.map((ticket) => [ticket.id, ticket])),
    nextNumber: slice.nextNumber || 1042,
  };
}

function persistAll() {
  if (!globalStore.__clabPosStore || !globalStore.__clabLegacyStore) return;
  try {
    savePersisted({
      bar: sliceFromStore(globalStore.__clabPosStore),
      legacy: sliceFromStore(globalStore.__clabLegacyStore),
    });
  } catch (error) {
    console.error("Failed to persist POS data", error);
  }
}

function boot() {
  if (globalStore.__clabPosStore && globalStore.__clabLegacyStore) return;
  const saved = loadPersisted();
  globalStore.__clabPosStore = storeFromSlice(saved?.bar);
  globalStore.__clabLegacyStore = storeFromSlice(saved?.legacy);
}

export function getBarStore(): MemoryStore {
  boot();
  return globalStore.__clabPosStore!;
}

export function getLegacyStore(): MemoryStore {
  boot();
  return globalStore.__clabLegacyStore!;
}

export function listTickets(store: MemoryStore): Ticket[] {
  return [...store.tickets.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function getTicket(store: MemoryStore, id: string): Ticket | undefined {
  return store.tickets.get(id);
}

export function createTicket(store: MemoryStore, payload: TicketPayload): Ticket {
  const createdAt = nowIso();
  const ticket: Ticket = {
    id: newId("tkt"),
    number: store.nextNumber++,
    seatId: payload.seatId,
    guestName: payload.guestName,
    guestCount: payload.guestCount,
    server: payload.server,
    status: "open",
    lines: [],
    payments: [],
    createdAt,
    updatedAt: createdAt,
    syncedToExisting: false,
  };
  store.tickets.set(ticket.id, ticket);
  persistAll();
  return ticket;
}

export function upsertTicket(store: MemoryStore, ticket: Ticket): Ticket {
  const next = { ...ticket, updatedAt: nowIso() };
  store.tickets.set(next.id, next);
  persistAll();
  return next;
}

export function applyPayment(store: MemoryStore, id: string, payload: PayPayload): Ticket {
  const ticket = store.tickets.get(id);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const payment = {
    id: newId("pay"),
    method: payload.method,
    amount: payload.amount,
    tendered: payload.tendered,
    createdAt: nowIso(),
  };

  const payments = [...ticket.payments, payment];
  const paid = paidTotal(payments);
  const total = ticketSubtotal(ticket.lines) + taxOn(ticketSubtotal(ticket.lines));
  const settled = paid + 0.005 >= total;
  const next: Ticket = {
    ...ticket,
    payments,
    status: settled ? "paid" : ticket.status === "void" ? "void" : ticket.status,
    paidAt: settled ? nowIso() : ticket.paidAt,
    updatedAt: nowIso(),
  };

  store.tickets.set(id, next);
  persistAll();
  return next;
}

export function localCatalog(): MenuItem[] {
  return LOCAL_CATALOG;
}

export function legacyCatalog(): MenuItem[] {
  return [
    ...LOCAL_CATALOG.map((item) => ({ ...item, source: "existing-pos" as const })),
    ...EXISTING_POS_EXTRAS,
  ];
}
