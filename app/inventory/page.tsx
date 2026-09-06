"use client";

import { useState } from "react";
import * as api from "@/lib/club/client";
import { money } from "@/lib/club/money";
import { useClub } from "@/lib/club/use-club";

export default function InventoryPage() {
  const { state, run } = useClub();
  const [qty, setQty] = useState("750");
  const [note, setNote] = useState("Stock in");

  if (!state) return <p className="p-6 text-zinc-400">Loading inventory…</p>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Stock</p>
        <h1 className="mt-1 text-2xl font-semibold">Inventory</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Selling a Mojito deducts rum, lime, syrup, mint, and soda from this ledger.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/4 text-zinc-400">
            <tr>
              <th className="px-3 py-2">Ingredient</th>
              <th className="px-3 py-2">On hand</th>
              <th className="px-3 py-2">Min</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {state.ingredients.map((ingredient) => {
              const low = ingredient.stock <= ingredient.minimumStock;
              return (
                <tr key={ingredient.id} className="border-t border-white/6">
                  <td className="px-3 py-2">{ingredient.name}</td>
                  <td className={`px-3 py-2 ${low ? "text-rose-300" : ""}`}>
                    {ingredient.stock} {ingredient.unit}
                  </td>
                  <td className="px-3 py-2 text-zinc-400">
                    {ingredient.minimumStock} {ingredient.unit}
                  </td>
                  <td className="px-3 py-2">{money(ingredient.cost)}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-white/8 px-2 py-1"
                        onClick={() =>
                          void run(() =>
                            api.adjustStock(ingredient.id, Number(qty) || 0, "in", note || "Stock in"),
                          )
                        }
                      >
                        In
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-white/8 px-2 py-1 text-rose-200"
                        onClick={() =>
                          void run(() =>
                            api.adjustStock(
                              ingredient.id,
                              -(Number(qty) || 0),
                              "waste",
                              note || "Waste",
                            ),
                          )
                        }
                      >
                        Waste
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={qty} onChange={(e) => setQty(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-black/30 px-3" placeholder="Qty" />
        <input value={note} onChange={(e) => setNote(e.target.value)} className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-3" placeholder="Note" />
      </div>

      <section>
        <h2 className="font-semibold">Recent movements</h2>
        <div className="mt-3 space-y-2 text-sm text-zinc-400">
          {state.txns.slice(0, 12).map((txn) => (
            <p key={txn.id}>
              {txn.kind} · {txn.qty} · {txn.note}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
