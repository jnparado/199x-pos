"use client";

import { money } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";
import type { MenuCategory } from "@/lib/types";

const FILTERS: Array<MenuCategory | "popular" | "all"> = [
  "popular",
  "all",
  "draft",
  "bottles",
  "wine",
  "cocktails",
  "spirits",
  "shots",
  "na",
  "food",
];

function filterLabel(
  key: (typeof FILTERS)[number],
  categories: PosState["categories"],
) {
  if (key === "popular") return "Popular";
  if (key === "all") return "All";
  return categories[key].label;
}

export function MenuBoard({ pos }: { pos: PosState }) {
  const canRing = Boolean(pos.activeTicket) && pos.activeTicket?.status !== "paid";

  return (
    <div className="flex h-full flex-col">
      {!canRing ? (
        <div className="flex items-center justify-between gap-3 border-b border-amber-300/20 bg-amber-300/10 px-4 py-3">
          <p className="text-sm text-amber-100">Open a table and assign a waiter first.</p>
          <button
            type="button"
            onClick={() => pos.setView("floor")}
            className="h-9 shrink-0 rounded-xl bg-amber-300 px-3 text-sm font-semibold text-stone-950"
          >
            Floor
          </button>
        </div>
      ) : null}
      <div className="border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            value={pos.query}
            onChange={(event) => pos.setQuery(event.target.value)}
            placeholder="Search drinks, SKU…"
            className="h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-base text-[var(--cream)] outline-none placeholder:text-stone-500 focus:border-amber-300/50 sm:text-sm"
          />
          {pos.happyHour ? (
            <span className="hidden rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-stone-950 sm:inline">
              Happy hour
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => pos.setCategory(filter)}
              className={`h-9 shrink-0 rounded-full px-3 text-sm font-medium ${
                pos.category === filter
                  ? "bg-amber-300 text-stone-950"
                  : "bg-white/6 text-stone-300 hover:bg-white/10"
              }`}
            >
              {filterLabel(filter, pos.categories)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto p-4 md:grid-cols-3 xl:grid-cols-4">
        {pos.visibleItems.map((item) => {
          const price = pos.itemPrice(item);
          const discounted = price !== item.price;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!canRing}
              onClick={() => void pos.ringItem(item)}
              className="min-h-28 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-3 text-left transition hover:border-amber-300/40 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${pos.categories[item.category].accent}`}
                >
                  {pos.categories[item.category].label}
                </span>
                {item.source === "existing-pos" ? (
                  <span className="text-[10px] uppercase tracking-wide text-sky-300">
                    POS
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-sm font-semibold leading-tight text-[var(--cream)]">
                {item.name}
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-base font-semibold text-amber-200">
                    {money(price)}
                  </div>
                  {discounted ? (
                    <div className="text-xs text-stone-500 line-through">
                      {money(item.price)}
                    </div>
                  ) : null}
                </div>
                {item.modifiers?.length ? (
                  <span className="text-[10px] text-stone-500">mods</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
