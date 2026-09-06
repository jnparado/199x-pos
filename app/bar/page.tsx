"use client";

import * as api from "@/lib/club/client";
import { useClub } from "@/lib/club/use-club";

const NEXT: Record<string, "preparing" | "ready" | "served"> = {
  new: "preparing",
  preparing: "ready",
  ready: "served",
};

export default function BarDisplayPage() {
  const { state, run } = useClub();
  if (!state) return <p className="p-6 text-zinc-400">Loading bar display…</p>;

  const tickets = state.orders.filter(
    (order) =>
      (order.status === "sent" || order.status === "open") &&
      order.ticketStatus !== "served" &&
      order.items.some((item) => !item.voided),
  );

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Bar display</p>
        <h1 className="mt-1 text-2xl font-semibold">Bar orders</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((order) => (
          <div key={order.id} className="rounded-2xl border border-white/8 bg-black/70 p-4">
            <div className="flex justify-between">
              <p className="font-semibold">#{order.number}</p>
              <p className="text-xs uppercase text-kada-green">{order.ticketStatus}</p>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {order.items.filter((item) => !item.voided).map((item) => (
                <p key={item.id}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>
            {NEXT[order.ticketStatus] ? (
              <button
                type="button"
                className="mt-4 h-10 w-full rounded-xl bg-kada-green text-sm font-semibold text-zinc-950"
                onClick={() =>
                  void run(() => api.setTicket(order.id, NEXT[order.ticketStatus]))
                }
              >
                Mark {NEXT[order.ticketStatus]}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
