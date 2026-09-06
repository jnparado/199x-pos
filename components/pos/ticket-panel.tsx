"use client";

import { money, ticketLabel } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";

export function TicketPanel({
  pos,
  onClose,
}: {
  pos: PosState;
  onClose?: () => void;
}) {
  const ticket = pos.activeTicket;
  const seat = pos.seats.find((item) => item.id === ticket?.seatId);

  if (!ticket) {
    return (
      <aside className={`flex h-full flex-col justify-center bg-black/20 px-6 text-center ${onClose ? "" : "border-l border-white/8"}`}>
        <p className="text-sm text-stone-400">
          Select a seat on the floor to open a tab.
        </p>
        <button
          type="button"
          onClick={() => pos.setView("floor")}
          className="mt-4 h-11 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-stone-950"
        >
          Go to floor
        </button>
      </aside>
    );
  }

  return (
    <aside className={`flex h-full flex-col bg-black/25 ${onClose ? "" : "border-l border-white/8"}`}>
      <div className="border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
            Ticket {ticketLabel(ticket)}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              ticket.status === "paid"
                ? "bg-emerald-400/20 text-emerald-200"
                : ticket.status === "sent"
                  ? "bg-sky-400/20 text-sky-200"
                  : "bg-amber-400/15 text-amber-200"
            }`}
          >
            {ticket.status}
          </span>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-xs font-medium text-amber-200"
          >
            Close ticket
          </button>
        ) : null}
        <h2 className="mt-1 text-xl font-semibold text-[var(--cream)]">
          {seat?.label || ticket.seatId}
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-stone-400">
          <span>{ticket.guestCount} guests</span>
          {ticket.status !== "paid" && ticket.status !== "void" ? (
            <span className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => void pos.setGuestCount(ticket.guestCount - 1)}
                className="grid h-6 w-6 place-items-center rounded bg-white/8"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => void pos.setGuestCount(ticket.guestCount + 1)}
                className="grid h-6 w-6 place-items-center rounded bg-white/8"
              >
                +
              </button>
            </span>
          ) : null}
          {ticket.syncedToExisting ? " · synced" : ""}
        </p>
        <button
          type="button"
          disabled={ticket.status === "paid" || ticket.status === "void"}
          onClick={() =>
            pos.setAssigning({
              seatId: ticket.seatId,
              guestName: ticket.guestName,
              ticketId: ticket.id,
            })
          }
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-left disabled:opacity-40"
        >
          <span>
            <span className="block text-[10px] uppercase tracking-wide text-stone-500">
              Waiter
            </span>
            <span className="text-sm font-semibold text-[var(--cream)]">
              {ticket.server}
            </span>
          </span>
          <span className="text-xs font-medium text-amber-200">Assign waiter</span>
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {ticket.lines.length === 0 ? (
          <p className="px-1 pt-6 text-center text-sm text-stone-500">
            Ring items from the menu.
          </p>
        ) : null}
        {ticket.lines.map((line) => (
          <div
            key={line.id}
            className="rounded-xl border border-white/8 bg-white/4 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-sm font-medium ${line.comped ? "text-stone-500 line-through" : "text-[var(--cream)]"}`}
                >
                  {line.name}
                </p>
                {line.modifiers.length ? (
                  <p className="text-xs text-stone-400">
                    {line.modifiers.map((modifier) => modifier.label).join(", ")}
                  </p>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-amber-200">
                {money(pos.lineTotal(line))}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void pos.changeQty(line.id, -1)}
                  className="h-8 w-8 rounded-lg bg-white/8 text-lg text-[var(--cream)]"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm">{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => void pos.changeQty(line.id, 1)}
                  className="h-8 w-8 rounded-lg bg-white/8 text-lg text-[var(--cream)]"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => void pos.toggleComp(line.id)}
                className="text-xs text-stone-400 hover:text-amber-200"
              >
                {line.comped ? "Uncomp" : "Comp"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8 px-4 py-4">
        <Row label="Subtotal" value={money(pos.totals.subtotal)} />
        <Row label="Tax" value={money(pos.totals.tax)} />
        <Row label="Total" value={money(pos.totals.total)} strong />
        {pos.totals.paid > 0 ? (
          <Row label="Paid" value={money(pos.totals.paid)} />
        ) : null}
        <Row label="Due" value={money(pos.totals.due)} strong />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={ticket.lines.length === 0 || ticket.status === "paid"}
            onClick={() => void pos.sendTicket()}
            className="h-11 rounded-xl border border-white/15 text-sm font-semibold text-[var(--cream)] disabled:opacity-40"
          >
            Send to bar
          </button>
          <button
            type="button"
            disabled={ticket.lines.length === 0 || pos.totals.due <= 0}
            onClick={() => pos.setPaying(true)}
            className="h-11 rounded-xl bg-amber-300 text-sm font-semibold text-stone-950 disabled:opacity-40"
          >
            Pay
          </button>
          <button
            type="button"
            onClick={() => {
              onClose?.();
              pos.setView("floor");
            }}
            className="h-10 rounded-xl text-sm text-stone-400"
          >
            Back to floor
          </button>
          <button
            type="button"
            disabled={ticket.status === "paid"}
            onClick={() => void pos.voidTicket()}
            className="h-10 rounded-xl text-sm text-rose-300/80 disabled:opacity-40"
          >
            Void tab
          </button>
        </div>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-stone-400">{label}</span>
      <span className={strong ? "font-semibold text-[var(--cream)]" : "text-stone-200"}>
        {value}
      </span>
    </div>
  );
}
