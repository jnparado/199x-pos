"use client";

import { useState } from "react";
import { ticketLabel } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";
import type { Seat } from "@/lib/types";

const GROUPS: { kind: Seat["kind"]; title: string }[] = [
  { kind: "bar", title: "Bar rail" },
  { kind: "booth", title: "Booths" },
  { kind: "table", title: "Floor" },
  { kind: "patio", title: "Patio" },
];

export function FloorBoard({ pos }: { pos: PosState }) {
  const [walkUpName, setWalkUpName] = useState("");

  function onSeat(seat: Seat) {
    if (seat.kind === "walkup") {
      pos.requestAssign(seat.id, walkUpName.trim() || "Walk-up");
      setWalkUpName("");
      return;
    }
    pos.requestAssign(seat.id);
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200/70">
          Floor
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--cream)] sm:text-2xl">
          Open a tab
        </h2>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-3 sm:flex-row sm:items-center sm:gap-3">
        <input
          value={walkUpName}
          onChange={(event) => setWalkUpName(event.target.value)}
          placeholder="Walk-up guest name"
          className="h-11 w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-base text-[var(--cream)] outline-none placeholder:text-stone-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={() => onSeat(pos.seats[0])}
          className="h-11 shrink-0 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-stone-950"
        >
          Assign waiter & open
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip
          label="All waiters"
          active={pos.waiterFilter === "all"}
          onClick={() => pos.setWaiterFilter("all")}
        />
        {pos.servers.map((waiter) => (
          <FilterChip
            key={waiter}
            label={waiter}
            active={pos.waiterFilter === waiter}
            onClick={() => pos.setWaiterFilter(waiter)}
          />
        ))}
      </div>

      {GROUPS.map((group) => {
        const seats = pos.seats.filter((seat) => {
          if (seat.kind !== group.kind) return false;
          if (pos.waiterFilter === "all") return true;
          const ticket = pos.openBySeat.get(seat.id);
          return !ticket || ticket.server === pos.waiterFilter;
        });
        if (seats.length === 0) return null;
        return (
          <section key={group.kind}>
            <h3 className="mb-3 text-sm font-medium text-stone-400">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 xl:grid-cols-8">
              {seats.map((seat) => {
                const ticket = pos.openBySeat.get(seat.id);
                const occupied = Boolean(ticket);
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => onSeat(seat)}
                    className={`min-h-20 rounded-2xl border px-3 py-3 text-left transition sm:min-h-24 ${
                      occupied
                        ? "border-amber-400/40 bg-amber-400/15 shadow-[0_0_0_1px_rgba(232,165,75,0.15)]"
                        : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <div className="text-sm font-semibold text-[var(--cream)]">
                      {seat.label}
                    </div>
                    <div className="mt-1 text-xs text-stone-400">
                      {occupied && ticket
                        ? ticketLabel(ticket)
                        : `${seat.capacity} top`}
                    </div>
                    {occupied && ticket ? (
                      <div className="mt-2 text-xs font-medium text-amber-200">
                        {ticket.server} · {ticket.lines.length} items
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-stone-500">Assign waiter</div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-3 text-sm font-medium ${
        active ? "bg-amber-300 text-stone-950" : "bg-white/6 text-stone-300"
      }`}
    >
      {label}
    </button>
  );
}
