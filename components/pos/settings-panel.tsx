"use client";

import { money, ticketLabel } from "@/lib/format";
import type { PosState } from "@/lib/pos/use-pos";
import { ticketSubtotal } from "@/lib/format";

export function SettingsPanel({ pos }: { pos: PosState }) {
  const connection = pos.connection;
  const paid = pos.tickets.filter((ticket) => ticket.status === "paid");
  const open = pos.tickets.filter(
    (ticket) => ticket.status === "open" || ticket.status === "sent",
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200/70">
        Connection
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-[var(--cream)]">
        Existing POS
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
        This terminal rings sales for the bar and syncs tickets back to the
        house POS. Point <code className="text-amber-200">EXISTING_POS_URL</code>{" "}
        at the live register API when you are ready. Until then it talks to the
        built-in C-Lab existing-POS adapter.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Status</p>
          <p className="mt-2 text-lg font-semibold text-[var(--cream)]">
            {connection?.healthy ? "Connected" : "Local fallback"}
          </p>
          <p className="mt-1 text-sm text-stone-400">
            {connection?.message || "Checking…"}
          </p>
          <p className="mt-3 break-all text-xs text-stone-500">
            {connection?.existingPosUrl}
          </p>
          <button
            type="button"
            onClick={() => void pos.sync()}
            className="mt-4 h-10 rounded-xl bg-amber-300 px-4 text-sm font-semibold text-stone-950"
          >
            Sync catalog & tickets
          </button>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">
            Expected API
          </p>
          <ul className="mt-3 space-y-1 font-mono text-xs text-stone-300">
            <li>GET /health</li>
            <li>GET /catalog</li>
            <li>GET /tickets</li>
            <li>POST /tickets</li>
          </ul>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            Send{" "}
            <code className="text-stone-300">Authorization: Bearer API_KEY</code>.
            Set <code className="text-stone-300">EXISTING_POS_API_KEY</code> and{" "}
            <code className="text-stone-300">VENUE_NAME</code> in{" "}
            <code className="text-stone-300">.env.local</code>.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <TicketList
          title="Open tabs"
          tickets={open}
          empty="No open tabs."
          onOpen={(id) => pos.selectTicket(id)}
        />
        <TicketList
          title="Closed & synced"
          tickets={paid}
          empty="No paid tickets yet."
          onOpen={(id) => pos.selectTicket(id)}
        />
      </div>
    </div>
  );
}

function TicketList({
  title,
  tickets,
  empty,
  onOpen,
}: {
  title: string;
  tickets: PosState["tickets"];
  empty: string;
  onOpen: (id: string) => void;
}) {
  return (
    <section>
      <h3 className="text-sm font-medium text-stone-300">{title}</h3>
      <div className="mt-3 space-y-2">
        {tickets.length === 0 ? (
          <p className="text-sm text-stone-500">{empty}</p>
        ) : null}
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            type="button"
            onClick={() => onOpen(ticket.id)}
            className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-left"
          >
            <div>
              <p className="text-sm text-[var(--cream)]">{ticketLabel(ticket)}</p>
              <p className="text-xs text-stone-500">
                {ticket.server}
                {ticket.syncedToExisting ? " · on existing POS" : " · local only"}
              </p>
            </div>
            <p className="text-sm text-amber-200">{money(ticketSubtotal(ticket.lines))}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
