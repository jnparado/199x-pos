"use client";

import Link from "next/link";
import { money } from "@/lib/club/money";
import { useClub, useDashboard } from "@/lib/club/use-club";

export default function DashboardPage() {
  const { state } = useClub();
  const stats = useDashboard(state);

  if (!state || !stats) {
    return <p className="p-6 text-zinc-400">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Today</p>
        <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card label="Gross sales" value={money(stats.gross)} accent="border-kada-green" />
        <Card label="Net / revenue" value={money(stats.net)} accent="border-kada-blue" />
        <Card label="Profit" value={money(stats.profit)} accent="border-kada-yellow" />
        <Card label="Orders" value={String(stats.orders)} accent="border-kada-orange" />
        <Card label="Open tables" value={String(stats.openTables)} accent="border-kada-red" />
        <Card label="Open tabs" value={String(stats.openTabs)} accent="border-kada-green" />
        <Card label="Cash" value={money(stats.byPay.cash || 0)} accent="border-kada-yellow" />
        <Card label="Card / e-wallet" value={money((stats.byPay.card || 0) + (stats.byPay.gcash || 0) + (stats.byPay.maya || 0))} accent="border-kada-blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Best-selling drinks</h2>
            <Link href="/reports" className="text-sm text-kada-green">
              Reports
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {stats.best.length === 0 ? (
              <p className="text-sm text-zinc-500">No paid sales yet today.</p>
            ) : null}
            {stats.best.map((item, index) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span>
                  {index + 1}. {item.name}
                </span>
                <span className="text-kada-yellow">
                  {item.qty} · {money(item.sales)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
          <h2 className="font-semibold">Low stock</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[...stats.lowProducts.map((p) => `${p.name} · ${p.inventory} ${p.unit}`), ...stats.lowIngredients.map((i) => `${i.name} · ${i.stock} ${i.unit}`)].length === 0 ? (
              <p className="text-zinc-500">All stock is healthy.</p>
            ) : null}
            {stats.lowProducts.map((product) => (
              <p key={product.id} className="text-rose-200">
                {product.name} · {product.inventory} {product.unit}
              </p>
            ))}
            {stats.lowIngredients.map((ingredient) => (
              <p key={ingredient.id} className="text-rose-200">
                {ingredient.name} · {ingredient.stock} {ingredient.unit}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent transactions</h2>
          <Link href="/pos" className="text-sm text-kada-green">
            Open POS
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {stats.recent.map((order) => (
            <div key={order.id} className="flex justify-between text-sm text-zinc-300">
              <span>
                #{order.number} {order.tabNo ? `· ${order.tabNo}` : ""} · {order.customerName || order.tableId || "Walk-up"}
              </span>
              <span className="capitalize text-zinc-400">{order.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/8 border-l-4 bg-black/50 p-3 sm:p-4 ${accent}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">{label}</p>
      <p className="mt-2 break-words text-lg font-bold text-white sm:text-xl">{value}</p>
    </div>
  );
}
