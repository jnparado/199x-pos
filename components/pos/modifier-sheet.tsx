"use client";

import { useState } from "react";
import { money } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";
import type { Modifier } from "@/lib/types";

export function ModifierSheet({ pos }: { pos: PosState }) {
  const item = pos.pendingItem;
  const [selected, setSelected] = useState<Modifier[]>([]);

  if (!item) return null;

  function toggle(modifier: Modifier) {
    setSelected((current) =>
      current.some((entry) => entry.id === modifier.id)
        ? current.filter((entry) => entry.id !== modifier.id)
        : [...current, modifier],
    );
  }

  const extras = selected.reduce((sum, modifier) => sum + modifier.price, 0);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl border border-white/10 bg-[#1a1612] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
              Modifiers
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--cream)]">
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              pos.setPendingItem(null);
            }}
            className="text-sm text-stone-400"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.modifiers?.map((modifier) => {
            const on = selected.some((entry) => entry.id === modifier.id);
            return (
              <button
                key={modifier.id}
                type="button"
                onClick={() => toggle(modifier)}
                className={`h-11 rounded-xl px-3 text-sm font-medium ${
                  on
                    ? "bg-amber-300 text-stone-950"
                    : "bg-white/8 text-stone-200"
                }`}
              >
                {modifier.label}
                {modifier.price ? ` · ${money(modifier.price)}` : ""}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={async () => {
            await pos.addLine(item, selected);
            setSelected([]);
            pos.setPendingItem(null);
          }}
          className="mt-5 h-12 w-full rounded-xl bg-amber-300 text-sm font-semibold text-stone-950"
        >
          Add · {money(pos.itemPrice(item) + extras)}
        </button>
      </div>
    </div>
  );
}
