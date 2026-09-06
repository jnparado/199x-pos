"use client";

import { useEffect, useMemo, useState } from "react";
import type { PosState } from "@/lib/pos/use-pos";

export function AssignWaiterSheet({ pos }: { pos: PosState }) {
  const pending = pos.assigning;
  const seat = pending
    ? pos.seats.find((item) => item.id === pending.seatId)
    : undefined;
  const ticket = pending?.ticketId
    ? pos.tickets.find((item) => item.id === pending.ticketId)
    : null;
  const defaultGuests = ticket?.guestCount || seat?.capacity || 1;
  const [guestCount, setGuestCount] = useState(defaultGuests);

  useEffect(() => {
    setGuestCount(defaultGuests);
  }, [defaultGuests, pending?.seatId, pending?.ticketId]);

  const current = ticket?.server;
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const waiter of pos.servers) map.set(waiter, 0);
    for (const open of pos.tickets) {
      if (open.status === "paid" || open.status === "void") continue;
      map.set(open.server, (map.get(open.server) || 0) + 1);
    }
    return map;
  }, [pos.servers, pos.tickets]);

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1a1612] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
              Assign waiter
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--cream)]">
              {seat?.label || pending.seatId}
              {pending.guestName ? ` · ${pending.guestName}` : ""}
            </h3>
            <p className="mt-1 text-sm text-stone-400">
              {ticket
                ? `Currently ${current}. Pick who owns this tab.`
                : "Choose the waiter, then the tab opens."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => pos.setAssigning(null)}
            className="h-10 rounded-xl px-3 text-sm text-stone-400"
          >
            Cancel
          </button>
        </div>

        {!ticket ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-sm text-stone-300">Guests</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestCount((count) => Math.max(1, count - 1))}
                className="h-10 w-10 rounded-xl bg-white/8 text-lg text-[var(--cream)]"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold">{guestCount}</span>
              <button
                type="button"
                onClick={() => setGuestCount((count) => count + 1)}
                className="h-10 w-10 rounded-xl bg-white/8 text-lg text-[var(--cream)]"
              >
                +
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {pos.servers.map((waiter) => {
            const selected = current === waiter;
            const tabs = counts.get(waiter) || 0;
            return (
              <button
                key={waiter}
                type="button"
                onClick={() => void pos.assignWaiter(waiter, guestCount)}
                className={`min-h-16 rounded-2xl border px-3 py-3 text-left ${
                  selected
                    ? "border-amber-300 bg-amber-300 text-stone-950"
                    : "border-white/10 bg-white/6 text-[var(--cream)]"
                }`}
              >
                <div className="text-sm font-semibold">{waiter}</div>
                <div className={`mt-0.5 text-xs ${selected ? "text-stone-800" : "text-stone-400"}`}>
                  {tabs} open tab{tabs === 1 ? "" : "s"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
