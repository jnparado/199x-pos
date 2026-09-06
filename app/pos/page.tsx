"use client";

import { useMemo, useState } from "react";
import * as api from "@/lib/club/client";
import { isHappyHour, lineTotal, money, orderTotals } from "@/lib/club/money";
import { useClub } from "@/lib/club/use-club";
import type { PayMethod } from "@/lib/club/types";

export default function PosPage() {
  const { state, user, activeOrder, setActiveOrderId, run } = useClub();
  const [categoryId, setCategoryId] = useState("beer");
  const [query, setQuery] = useState("");
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("cash");
  const [tendered, setTendered] = useState("");
  const [receipt, setReceipt] = useState(false);
  const happy = isHappyHour();

  const products = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    return state.products.filter((product) => {
      if (!product.active) return false;
      if (product.categoryId !== categoryId && !q) return false;
      return !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q);
    });
  }, [state, categoryId, query]);

  if (!state || !user) {
    return <p className="p-6 text-zinc-400">Sign in to use the register.</p>;
  }

  const staff = user;
  const order = activeOrder;
  const totals = order ? orderTotals(order, state.venue.taxRate, state.venue.serviceRate) : null;
  const table = state.tables.find((item) => item.id === order?.tableId);

  async function ensureOrder() {
    if (order) return order.id;
    const result = await run(() =>
      api.openOrder({
        serverId: staff.id,
        customerName: "Walk-up",
      }),
    );
    if (result.orderId) setActiveOrderId(result.orderId);
    return result.orderId;
  }

  async function ring(productId: string) {
    const orderId = order?.id || (await ensureOrder());
    if (!orderId) return;
    await run(() => api.addItem(orderId, productId));
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_340px]">
      <aside className="border-b border-white/8 p-3 lg:border-b-0 lg:border-r">
        <p className="px-2 text-xs uppercase tracking-wide text-zinc-500">Categories</p>
        <div className="mt-2 flex gap-2 overflow-x-auto lg:flex-col">
          {state.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`min-h-11 rounded-xl px-3 text-left text-sm ${
                categoryId === category.id
                  ? "bg-kada-green font-semibold text-zinc-950"
                  : "bg-white/4 text-zinc-200"
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </aside>

      <section className="min-h-0 overflow-y-auto p-3">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, SKU…"
            className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-base text-white outline-none"
          />
          {happy ? (
            <span className="hidden h-11 items-center rounded-xl bg-kada-green px-3 text-sm font-semibold text-zinc-950 sm:flex">
              Happy hour
            </span>
          ) : null}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {products.map((product) => {
            const price = happy && product.happyHourPrice != null ? product.happyHourPrice : product.price;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => void ring(product.id)}
                className="min-h-24 rounded-2xl border border-white/8 bg-black/70 p-3 text-left"
              >
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="mt-2 text-kada-yellow">{money(price)}</p>
                {product.happyHourPrice && happy ? (
                  <p className="text-xs text-zinc-500 line-through">{money(product.price)}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col border-t border-white/8 bg-black/80 lg:border-l lg:border-t-0">
        <div className="border-b border-white/8 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Current order</p>
          <h2 className="text-lg font-semibold">
            {order ? `#${order.number}${order.tabNo ? ` · ${order.tabNo}` : ""}` : "No order"}
          </h2>
          <p className="text-sm text-zinc-400">
            {table?.label || "Walk-up"} · {order?.customerName || staff.name}
          </p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {order?.items.map((item) => (
            <div key={item.id} className="rounded-xl bg-white/4 px-3 py-2">
              <div className="flex justify-between text-sm">
                <span className={item.voided ? "line-through text-zinc-500" : ""}>
                  {item.quantity}× {item.name}
                </span>
                <span className="text-kada-yellow">{money(lineTotal(item))}</span>
              </div>
              {item.note ? <p className="text-xs text-zinc-500">{item.note}</p> : null}
              <div className="mt-2 flex gap-2">
                <button type="button" className="h-8 w-8 rounded-lg bg-white/8" onClick={() => void run(() => api.changeQty(order.id, item.id, -1))}>−</button>
                <button type="button" className="h-8 w-8 rounded-lg bg-white/8" onClick={() => void run(() => api.changeQty(order.id, item.id, 1))}>+</button>
                <button type="button" className="text-xs text-zinc-400" onClick={() => {
                  const note = window.prompt("Item note", item.note || "");
                  if (note != null) void run(() => api.setNote(order.id, item.id, note));
                }}>Note</button>
                <button type="button" className="text-xs text-rose-300" onClick={() => void run(() => api.voidItem(order.id, item.id))}>Void</button>
              </div>
            </div>
          ))}
        </div>
        {totals && order ? (
          <div className="border-t border-white/8 p-4">
            <Row label="Subtotal" value={money(totals.sub)} />
            <Row label="Discount" value={money(totals.disc)} />
            <Row label="Service charge" value={money(totals.service)} />
            <Row label="Tax" value={money(totals.tax)} />
            <Row label="TOTAL" value={money(totals.total)} strong />
            <Row label="Due" value={money(totals.due)} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="h-10 rounded-xl border border-white/15 text-sm" onClick={() => void run(() => api.holdOrder(order.id))}>Hold</button>
              <button type="button" className="h-10 rounded-xl border border-white/15 text-sm" onClick={() => void run(() => api.sendOrder(order.id))}>Send to bar</button>
              <button type="button" className="h-10 rounded-xl text-sm text-rose-300" onClick={() => void run(() => api.voidOrder(order.id))}>Void order</button>
              <button type="button" className="h-10 rounded-xl bg-kada-green text-sm font-semibold text-zinc-950" onClick={() => { setPaying(true); setReceipt(false); setTendered(totals.due.toFixed(2)); }}>PAY</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button type="button" className="rounded-lg bg-white/6 px-2 py-1" onClick={() => void run(() => api.applyDiscount(order.id, { kind: "percent", label: "10% off", amount: totals.sub * 0.1 }))}>10% off</button>
              <button type="button" className="rounded-lg bg-white/6 px-2 py-1" onClick={() => void run(() => api.applyDiscount(order.id, { kind: "senior", label: "Senior", amount: totals.sub * 0.2 }))}>Senior/PWD</button>
              <button type="button" className="rounded-lg bg-white/6 px-2 py-1" onClick={() => void run(() => api.applyDiscount(order.id, { kind: "fixed", label: "₱100 off", amount: 100 }))}>₱100 off</button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <button
              type="button"
              className="h-11 w-full rounded-xl bg-kada-green font-semibold text-zinc-950"
              onClick={() => void ensureOrder()}
            >
              New walk-up order
            </button>
          </div>
        )}
      </aside>

      {paying && order && totals ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-black p-5 sm:rounded-3xl">
            {receipt ? (
              <Receipt orderNumber={order.number} table={table?.label} totals={totals} method={method} venue={state.venue.name} city={state.venue.city} items={order.items} onClose={() => setPaying(false)} />
            ) : (
              <>
                <h3 className="text-xl font-semibold">Pay {money(totals.due)}</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {(["cash", "card", "gcash", "maya", "bank"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMethod(item)}
                      className={`h-10 rounded-xl text-xs font-semibold uppercase ${method === item ? "bg-kada-green text-zinc-950" : "bg-white/8"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <input
                  value={tendered}
                  onChange={(event) => setTendered(event.target.value)}
                  className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-lg"
                />
                <div className="mt-3 flex gap-2">
                  <button type="button" className="h-11 flex-1 rounded-xl border border-white/15" onClick={() => setPaying(false)}>Close</button>
                  <button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-kada-green font-semibold text-zinc-950"
                    onClick={async () => {
                      const amount = Number(tendered) || totals.due;
                      await run(() => api.payOrder(order.id, method, Math.min(amount, totals.due)));
                      if (amount >= totals.due - 0.01) setReceipt(true);
                    }}
                  >
                    Collect
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between py-0.5 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={strong ? "font-semibold text-white" : "text-zinc-200"}>{value}</span>
    </div>
  );
}

function Receipt({
  orderNumber,
  table,
  totals,
  method,
  venue,
  city,
  items,
  onClose,
}: {
  orderNumber: number;
  table?: string;
  totals: ReturnType<typeof orderTotals>;
  method: string;
  venue: string;
  city: string;
  items: { name: string; quantity: number; unitPrice: number; voided?: boolean }[];
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-kada-green">{venue}</p>
      <p className="text-sm text-zinc-400">{city}</p>
      <p className="mt-3 text-sm">Table: {table || "Walk-up"} · Order #{String(orderNumber).padStart(6, "0")}</p>
      <div className="mt-3 space-y-1 text-left text-sm">
        {items.filter((item) => !item.voided).map((item) => (
          <div key={item.name + item.quantity} className="flex justify-between">
            <span>{item.quantity} × {item.name}</span>
            <span>{money(item.quantity * item.unitPrice)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1 text-left text-sm">
        <Row label="Subtotal" value={money(totals.sub)} />
        <Row label="Service charge" value={money(totals.service)} />
        <Row label="Tax" value={money(totals.tax)} />
        <Row label="TOTAL" value={money(totals.total)} strong />
        <Row label="Payment" value={method.toUpperCase()} />
      </div>
      <p className="mt-4 text-sm text-zinc-400">Thank you!</p>
      <button type="button" onClick={onClose} className="mt-4 h-11 w-full rounded-xl bg-kada-green font-semibold text-zinc-950">
        Done
      </button>
    </div>
  );
}
