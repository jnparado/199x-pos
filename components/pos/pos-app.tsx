"use client";

import { usePos } from "@/lib/pos/use-pos";
import { AssignWaiterSheet } from "./assign-waiter-sheet";
import { FloorBoard } from "./floor-board";
import { MenuBoard } from "./menu-board";
import { ModifierSheet } from "./modifier-sheet";
import { PaymentDrawer } from "./payment-drawer";
import { SettingsPanel } from "./settings-panel";
import { TicketPanel } from "./ticket-panel";

export function PosApp() {
  const pos = usePos();
  const showTicket = pos.view === "register" || Boolean(pos.activeTicket);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex flex-col gap-3 border-b border-white/8 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300 font-semibold text-stone-950">
              C
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-[var(--cream)]">
                C-Lab Bar POS
              </p>
              <p className="truncate text-xs text-stone-400">
                {pos.connection?.healthy ? "Linked to existing POS" : "Local mode"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pos.happyHour ? (
              <span className="hidden rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 sm:inline">
                Happy hour 4–7
              </span>
            ) : null}
            <label className="sr-only" htmlFor="signed-in-waiter">
              Signed-in waiter
            </label>
            <select
              id="signed-in-waiter"
              value={pos.server}
              onChange={(event) => pos.changeServer(event.target.value)}
              className="h-10 max-w-32 rounded-xl border border-white/10 bg-black/30 px-2 text-sm text-[var(--cream)] outline-none sm:max-w-none"
            >
              {pos.servers.map((server) => (
                <option key={server} value={server}>
                  {server}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className="flex w-full rounded-full bg-white/6 p-1 lg:w-auto">
          {(
            [
              ["floor", "Floor"],
              ["register", "Register"],
              ["settings", "POS link"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => pos.setView(id)}
              className={`h-9 flex-1 rounded-full px-3 text-sm font-medium lg:flex-none lg:px-4 ${
                pos.view === id
                  ? "bg-amber-300 text-stone-950"
                  : "text-stone-300"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {pos.error ? (
        <div className="bg-rose-500/15 px-4 py-2 text-sm text-rose-100">
          {pos.error}
        </div>
      ) : null}

      <main
        className={`grid min-h-0 flex-1 ${
          pos.view === "register"
            ? "grid-rows-[minmax(0,1fr)_minmax(240px,42%)] md:grid-rows-none md:grid-cols-[minmax(0,1fr)_380px]"
            : "grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {pos.view === "floor" ? <FloorBoard pos={pos} /> : null}
          {pos.view === "register" ? <MenuBoard pos={pos} /> : null}
          {pos.view === "settings" ? <SettingsPanel pos={pos} /> : null}
        </div>
        <div
          className={`min-h-0 overflow-hidden ${
            pos.view === "register" ? "block" : showTicket ? "hidden md:block" : "hidden md:block"
          }`}
        >
          <TicketPanel pos={pos} />
        </div>
      </main>

      {pos.busy ? (
        <div className="pointer-events-none absolute right-4 top-20 rounded-full bg-black/50 px-3 py-1 text-xs text-stone-300">
          Syncing…
        </div>
      ) : null}

      <AssignWaiterSheet pos={pos} />
      <ModifierSheet key={pos.pendingItem?.id ?? "mods"} pos={pos} />
      <PaymentDrawer pos={pos} />
    </div>
  );
}
