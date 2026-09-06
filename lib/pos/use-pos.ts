"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_META, SEATS, SERVERS } from "../catalog";
import {
  isHappyHour,
  lineTotal,
  newId,
  nowIso,
  paidTotal,
  taxOn,
  ticketSubtotal,
} from "../format";
import type {
  MenuCategory,
  MenuItem,
  Modifier,
  PosConnection,
  Ticket,
  TicketLine,
} from "../types";
import {
  createTicket,
  fetchCatalog,
  fetchTickets,
  payTicket,
  saveTicket,
  syncExistingPos,
  updateTicket,
} from "./api";

export type PosView = "floor" | "register" | "settings";

type AssignDraft = {
  seatId: string;
  guestName?: string;
  ticketId?: string;
  guestCount?: number;
};

function mergeTickets(current: Ticket[], incoming: Ticket[]): Ticket[] {
  const byId = new Map<string, Ticket>();
  for (const ticket of current) byId.set(ticket.id, ticket);
  for (const ticket of incoming) {
    const existing = byId.get(ticket.id);
    if (!existing || ticket.updatedAt >= existing.updatedAt) {
      byId.set(ticket.id, ticket);
    }
  }
  return [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function usePos() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [connection, setConnection] = useState<PosConnection | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [server, setServer] = useState(SERVERS[0]);
  const [category, setCategory] = useState<MenuCategory | "all" | "popular">(
    "popular",
  );
  const [view, setView] = useState<PosView>("floor");
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
  const [paying, setPaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [happyHour, setHappyHour] = useState(isHappyHour());
  const [assigning, setAssigning] = useState<AssignDraft | null>(null);
  const [waiterFilter, setWaiterFilter] = useState<string>("all");
  const assigningRef = useRef<AssignDraft | null>(null);
  const restoredRef = useRef(false);

  assigningRef.current = assigning;

  const activate = useCallback((ticketId: string | null) => {
    setActiveTicketId(ticketId);
    if (ticketId) {
      window.localStorage.setItem("clab-ticket", ticketId);
    } else {
      window.localStorage.removeItem("clab-ticket");
    }
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const [catalog, ticketData] = await Promise.all([
        fetchCatalog(),
        fetchTickets(),
      ]);
      setItems(catalog.items);
      setConnection(catalog.connection);
      setTickets((current) => mergeTickets(current, ticketData.tickets));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load POS");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const saved = window.localStorage.getItem("clab-server");
    if (saved && SERVERS.includes(saved)) {
      setServer(saved);
    }
    const timer = window.setInterval(() => setHappyHour(isHappyHour()), 30_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (restoredRef.current || tickets.length === 0) return;
    const savedId = window.localStorage.getItem("clab-ticket");
    if (savedId) {
      const match = tickets.find(
        (ticket) => ticket.id === savedId && ticket.status !== "void",
      );
      if (match) activate(match.id);
    }
    restoredRef.current = true;
  }, [activate, tickets]);

  const activeTicket =
    tickets.find((ticket) => ticket.id === activeTicketId) ?? null;

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (category === "all") return true;
      if (category === "popular") return Boolean(item.popular);
      return item.category === category;
    });
  }, [items, category, query]);

  const openBySeat = useMemo(() => {
    const map = new Map<string, Ticket>();
    for (const ticket of tickets) {
      if (ticket.status === "paid" || ticket.status === "void") continue;
      const current = map.get(ticket.seatId);
      if (!current || ticket.updatedAt > current.updatedAt) {
        map.set(ticket.seatId, ticket);
      }
    }
    return map;
  }, [tickets]);

  const persist = useCallback(async (ticket: Ticket) => {
    try {
      const { ticket: saved } = await saveTicket(ticket);
      setTickets((current) => mergeTickets(current, [saved]));
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save ticket");
      return ticket;
    }
  }, []);

  const openSeat = useCallback(
    async (
      seatId: string,
      guestName?: string,
      waiter?: string,
      guestCount?: number,
    ) => {
      const existing = tickets.find(
        (ticket) =>
          ticket.seatId === seatId &&
          ticket.status !== "paid" &&
          ticket.status !== "void" &&
          (seatId !== "walkup" || ticket.guestName === guestName),
      );
      if (existing) {
        activate(existing.id);
        setView("register");
        setAssigning(null);
        return existing;
      }

      const seat = SEATS.find((item) => item.id === seatId);
      const { ticket } = await createTicket({
        seatId,
        guestName,
        guestCount: guestCount || seat?.capacity || 1,
        server: waiter || server,
      });
      setTickets((current) => mergeTickets(current, [ticket]));
      activate(ticket.id);
      setView("register");
      setAssigning(null);
      assigningRef.current = null;
      return ticket;
    },
    [activate, server, tickets],
  );

  const selectTicket = useCallback(
    (ticketId: string) => {
      activate(ticketId);
      setView("register");
    },
    [activate],
  );

  const setGuestCount = useCallback(
    async (guestCount: number) => {
      if (!activeTicket || activeTicket.status === "paid") return;
      const next = {
        ...activeTicket,
        guestCount: Math.max(1, guestCount),
        updatedAt: nowIso(),
      };
      setTickets((current) => mergeTickets(current, [next]));
      await persist(next);
    },
    [activeTicket, persist],
  );

  const requestAssign = useCallback(
    (seatId: string, guestName?: string, ticketId?: string) => {
      const existing = tickets.find(
        (ticket) =>
          ticket.id === ticketId ||
          (ticket.seatId === seatId &&
            ticket.status !== "paid" &&
            ticket.status !== "void" &&
            (seatId !== "walkup" || ticket.guestName === guestName)),
      );
      if (existing && !ticketId) {
        activate(existing.id);
        setView("register");
        return;
      }
      const draft = { seatId, guestName, ticketId: ticketId || existing?.id };
      assigningRef.current = draft;
      setAssigning(draft);
    },
    [activate, tickets],
  );

  const assignWaiter = useCallback(
    async (waiter: string, guestCount?: number) => {
      const pending = assigningRef.current;
      if (!pending) return;
      if (pending.ticketId) {
        const ticket = tickets.find((item) => item.id === pending.ticketId);
        if (!ticket) return;
        const next = { ...ticket, server: waiter, updatedAt: nowIso() };
        setTickets((current) => mergeTickets(current, [next]));
        await persist(next);
        setAssigning(null);
        assigningRef.current = null;
        return;
      }
      await openSeat(pending.seatId, pending.guestName, waiter, guestCount);
    },
    [openSeat, persist, tickets],
  );

  const itemPrice = useCallback(
    (item: MenuItem) => {
      if (happyHour && item.happyHourPrice != null) return item.happyHourPrice;
      return item.price;
    },
    [happyHour],
  );

  const addLine = useCallback(
    async (item: MenuItem, modifiers: Modifier[] = [], note?: string) => {
      if (!activeTicket || activeTicket.status === "paid") return;
      const nextLine: TicketLine = {
        id: newId("ln"),
        itemId: item.id,
        name: item.name,
        unitPrice: itemPrice(item),
        quantity: 1,
        modifiers,
        note,
      };
      const next: Ticket = {
        ...activeTicket,
        lines: [...activeTicket.lines, nextLine],
        updatedAt: nowIso(),
      };
      setTickets((current) => mergeTickets(current, [next]));
      await persist(next);
    },
    [activeTicket, itemPrice, persist],
  );

  const ringItem = useCallback(
    async (item: MenuItem) => {
      if (!activeTicket) {
        setView("floor");
        return;
      }
      if (item.modifiers?.length) {
        setPendingItem(item);
        return;
      }
      await addLine(item);
    },
    [activeTicket, addLine],
  );

  const changeQty = useCallback(
    async (lineId: string, delta: number) => {
      if (!activeTicket) return;
      const lines = activeTicket.lines
        .map((line) =>
          line.id === lineId
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0);
      const next = { ...activeTicket, lines, updatedAt: nowIso() };
      setTickets((current) => mergeTickets(current, [next]));
      await persist(next);
    },
    [activeTicket, persist],
  );

  const toggleComp = useCallback(
    async (lineId: string) => {
      if (!activeTicket) return;
      const lines = activeTicket.lines.map((line) =>
        line.id === lineId ? { ...line, comped: !line.comped } : line,
      );
      const next = { ...activeTicket, lines, updatedAt: nowIso() };
      setTickets((current) => mergeTickets(current, [next]));
      await persist(next);
    },
    [activeTicket, persist],
  );

  const sendTicket = useCallback(async () => {
    if (!activeTicket) return;
    const next = await persist({
      ...activeTicket,
      status: "sent",
      sentAt: nowIso(),
    });
    activate(next.id);
  }, [activate, activeTicket, persist]);

  const voidTicket = useCallback(async () => {
    if (!activeTicket) return;
    await updateTicket(activeTicket.id, { status: "void" });
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === activeTicket.id ? { ...ticket, status: "void" } : ticket,
      ),
    );
    activate(null);
    setView("floor");
  }, [activate, activeTicket]);

  const collectPayment = useCallback(
    async (
      method: "cash" | "card" | "split" | "comp",
      amount: number,
      tendered?: number,
    ) => {
      if (!activeTicket) return;
      const { ticket } = await payTicket(activeTicket.id, {
        method,
        amount,
        tendered,
      });
      setTickets((current) => mergeTickets(current, [ticket]));
      activate(ticket.id);
      return ticket;
    },
    [activate, activeTicket],
  );

  const sync = useCallback(async () => {
    setBusy(true);
    try {
      const result = await syncExistingPos();
      setConnection(result.connection);
      const catalog = await fetchCatalog();
      setItems(catalog.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }, []);

  const changeServer = useCallback((name: string) => {
    setServer(name);
    window.localStorage.setItem("clab-server", name);
  }, []);

  const totals = useMemo(() => {
    if (!activeTicket) {
      return { subtotal: 0, tax: 0, total: 0, paid: 0, due: 0 };
    }
    const subtotal = ticketSubtotal(activeTicket.lines);
    const tax = taxOn(subtotal);
    const total = subtotal + tax;
    const paid = paidTotal(activeTicket.payments);
    return { subtotal, tax, total, paid, due: Math.max(total - paid, 0) };
  }, [activeTicket]);

  return {
    items,
    tickets,
    connection,
    activeTicket,
    server,
    servers: SERVERS,
    seats: SEATS,
    category,
    categories: CATEGORY_META,
    view,
    pendingItem,
    paying,
    busy,
    error,
    query,
    happyHour,
    visibleItems,
    openBySeat,
    assigning,
    waiterFilter,
    totals,
    lineTotal,
    itemPrice,
    setView,
    setCategory,
    setQuery,
    setPendingItem,
    setPaying,
    setError,
    load,
    setAssigning,
    setWaiterFilter,
    requestAssign,
    assignWaiter,
    selectTicket,
    setGuestCount,
    openSeat,
    ringItem,
    addLine,
    changeQty,
    toggleComp,
    sendTicket,
    voidTicket,
    collectPayment,
    sync,
    changeServer,
  };
}

export type PosState = ReturnType<typeof usePos>;
