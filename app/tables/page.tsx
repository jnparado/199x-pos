"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as api from "@/lib/club/client";
import { money, orderTotals } from "@/lib/club/money";
import { useClub } from "@/lib/club/use-club";

const DOT: Record<string, string> = {
  available: "bg-kada-green",
  occupied: "bg-kada-red",
  reserved: "bg-kada-yellow",
  closed: "bg-zinc-500",
};

export default function TablesPage() {
  const { state, user, setActiveOrderId, run } = useClub();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!state || !user) return <p className="p-6 text-zinc-400">Loading tables…</p>;

  const club = state;
  const staff = user;

  async function openTable(tableId: string, asTab: boolean) {
    const table = club.tables.find((item) => item.id === tableId);
    if (table?.orderId && table.status === "occupied") {
      setActiveOrderId(table.orderId);
      router.push("/pos");
      return;
    }
    await run(async () => {
      const result = await api.openOrder({
        tableId,
        serverId: staff.id,
        customerName: name || undefined,
        customerPhone: phone || undefined,
        asTab,
      });
      const order = result.state.orders.find((item) => item.tableId === tableId && item.status !== "void");
      if (order) setActiveOrderId(order.id);
      return result;
    });
    router.push("/pos");
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Floor plan</p>
        <h1 className="mt-1 text-2xl font-semibold">Tables & tabs</h1>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/3 p-3 sm:flex-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name (tab)" className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-3" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-3" />
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
        <Legend color="bg-kada-green" label="Available" />
        <Legend color="bg-kada-red" label="Occupied" />
        <Legend color="bg-kada-yellow" label="Reserved" />
        <Legend color="bg-zinc-500" label="Closed" />
      </div>

      {(["floor", "vip", "bar"] as const).map((section) => (
        <section key={section}>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-zinc-500">{section}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {state.tables.filter((table) => table.section === section).map((table) => {
              const order = state.orders.find((item) => item.id === table.orderId);
              const due = order ? orderTotals(order, state.venue.taxRate, state.venue.serviceRate).due : 0;
              return (
                <div key={table.id} className="rounded-2xl border border-white/8 bg-black/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{table.label}</p>
                    <span className={`h-3 w-3 rounded-full ${DOT[table.status]}`} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{table.seats} seats</p>
                  <p className="mt-2 text-kada-yellow">{money(due)}</p>
                  {order?.tabNo ? <p className="text-xs text-zinc-500">{order.tabNo} · {order.customerName}</p> : null}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" className="h-9 rounded-xl bg-kada-green text-xs font-semibold text-black" onClick={() => void openTable(table.id, false)}>
                      {table.status === "occupied" ? "Open" : "Seat"}
                    </button>
                    <button type="button" className="h-9 rounded-xl border border-white/15 text-xs" onClick={() => void openTable(table.id, true)}>
                      Tab
                    </button>
                    <button type="button" className="col-span-2 h-8 text-xs text-zinc-400" onClick={() => void run(() => api.reserveTable(table.id))}>
                      Toggle reserve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
