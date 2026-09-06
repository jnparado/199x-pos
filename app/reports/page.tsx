"use client";

import { money } from "@/lib/club/money";
import { useClub, useDashboard } from "@/lib/club/use-club";

export default function ReportsPage() {
  const { state } = useClub();
  const stats = useDashboard(state);
  if (!state || !stats) return <p className="p-6 text-zinc-400">Loading reports…</p>;

  const methods = [
    ["Cash", stats.byPay.cash || 0],
    ["GCash", stats.byPay.gcash || 0],
    ["Maya", stats.byPay.maya || 0],
    ["Card", stats.byPay.card || 0],
    ["Bank", stats.byPay.bank || 0],
  ] as const;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Today</p>
        <h1 className="mt-1 text-2xl font-semibold">Reports</h1>
      </div>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Daily sales</h2>
        <div className="mt-3 space-y-1 text-sm">
          <Row label="Gross sales" value={money(stats.gross)} />
          <Row label="Discounts" value={money(stats.discounts)} />
          <Row label="Tax" value={money(stats.tax)} />
          <Row label="Net sales" value={money(stats.net)} />
        </div>
      </section>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Payment report</h2>
        <div className="mt-3 space-y-1 text-sm">
          {methods.map(([label, value]) => (
            <Row key={label} label={label} value={money(value)} />
          ))}
          <Row label="Total" value={money(methods.reduce((sum, item) => sum + item[1], 0))} />
        </div>
      </section>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Product report</h2>
        <div className="mt-3 space-y-2 text-sm">
          {stats.best.map((item, index) => (
            <Row key={item.name} label={`${index + 1}. ${item.name}`} value={`${item.qty}`} />
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Inventory report · low stock</h2>
        <div className="mt-3 space-y-1 text-sm text-rose-200">
          {stats.lowIngredients.map((item) => (
            <p key={item.id}>
              {item.name} · {item.stock} {item.unit}
            </p>
          ))}
          {stats.lowProducts.map((item) => (
            <p key={item.id}>
              {item.name} · {item.inventory} {item.unit}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
