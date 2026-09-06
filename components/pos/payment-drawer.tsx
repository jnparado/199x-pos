"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { money, ticketLabel } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";
import type { PaymentMethod } from "@/lib/types";

const QUICK_CASH = [1, 5, 10, 20, 50, 100];

export function PaymentDrawer({ pos }: { pos: PosState }) {
  const due = pos.totals.due;
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [tendered, setTendered] = useState(due.toFixed(2));
  const [receipt, setReceipt] = useState(false);
  const wasPaying = useRef(false);

  useEffect(() => {
    if (pos.paying && !wasPaying.current) {
      setTendered(pos.totals.due.toFixed(2));
      setReceipt(false);
    }
    wasPaying.current = pos.paying;
  }, [pos.paying, pos.totals.due]);

  const cash = Number(tendered) || 0;
  const change = useMemo(
    () => (method === "cash" ? Math.max(cash - due, 0) : 0),
    [cash, due, method],
  );

  if (!pos.paying || !pos.activeTicket) return null;

  const ticket = pos.activeTicket;

  async function collect() {
    const amount = method === "comp" ? due : Math.min(cash || due, due);
    await pos.collectPayment(method, amount, method === "cash" ? cash : undefined);
    if (method === "split" && amount < due - 0.005) {
      setTendered((due - amount).toFixed(2));
      return;
    }
    setReceipt(true);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1a1612] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" />
        {receipt ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
              Receipt
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-[var(--cream)]">
              Paid {ticketLabel(ticket)}
            </h3>
            <p className="mt-1 text-sm text-stone-400">
              Waiter {ticket.server}
              {ticket.syncedToExisting ? " · synced to existing POS" : ""}
            </p>
            <div className="mt-4 space-y-2">
              {ticket.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex justify-between text-sm text-stone-300"
                >
                  <span>
                    {line.quantity}× {line.name}
                  </span>
                  <span>{money(pos.lineTotal(line))}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-base font-semibold text-[var(--cream)]">
              <span>Total</span>
              <span>{money(pos.totals.total)}</span>
            </div>
            <button
              type="button"
              onClick={() => pos.setPaying(false)}
              className="mt-5 h-12 w-full rounded-xl bg-amber-300 text-sm font-semibold text-stone-950"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
                  Payment
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-[var(--cream)]">
                  {money(due)} due
                </h3>
              </div>
              <button
                type="button"
                onClick={() => pos.setPaying(false)}
                className="text-sm text-stone-400"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {(["card", "cash", "split", "comp"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMethod(item);
                    if (item !== "cash") setTendered(due.toFixed(2));
                  }}
                  className={`h-11 rounded-xl text-sm font-semibold capitalize ${
                    method === item
                      ? "bg-amber-300 text-stone-950"
                      : "bg-white/8 text-stone-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {method === "cash" || method === "split" ? (
              <>
                <label className="mt-4 block text-xs text-stone-400">Tendered</label>
                <input
                  value={tendered}
                  onChange={(event) => setTendered(event.target.value)}
                  inputMode="decimal"
                  className="mt-1 h-12 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-lg text-[var(--cream)] outline-none"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_CASH.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTendered(String(Math.max(due, amount)))}
                      className="h-9 rounded-lg bg-white/8 px-3 text-sm text-stone-200"
                    >
                      {money(amount)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTendered(due.toFixed(2))}
                    className="h-9 rounded-lg bg-white/8 px-3 text-sm text-stone-200"
                  >
                    Exact
                  </button>
                </div>
                <p className="mt-3 text-sm text-stone-400">
                  Change {money(change)}
                </p>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => void collect()}
              className="mt-5 h-12 w-full rounded-xl bg-amber-300 text-sm font-semibold text-stone-950"
            >
              {method === "comp"
                ? "Comp balance"
                : `Collect ${money(Math.min(cash || due, due))}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
