"use client";

import * as api from "@/lib/club/client";
import { isHappyHour } from "@/lib/club/money";
import { useClub } from "@/lib/club/use-club";

export default function SettingsPage() {
  const { state, run } = useClub();
  if (!state) return <p className="p-6 text-zinc-400">Loading settings…</p>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">House</p>
        <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
      </div>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Venue</h2>
        <p className="mt-2 text-sm text-zinc-300">{state.venue.name}</p>
        <p className="text-sm text-zinc-400">{state.venue.city}</p>
        <p className="mt-3 text-sm text-zinc-400">
          Tax {(state.venue.taxRate * 100).toFixed(0)}% · Service charge{" "}
          {(state.venue.serviceRate * 100).toFixed(0)}%
        </p>
        <p className="mt-2 text-sm text-kada-yellow">
          Happy hour 5:00 PM – 7:00 PM {isHappyHour() ? "· active now" : "· scheduled"}
        </p>
      </section>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Payments</h2>
        <p className="mt-2 text-sm text-zinc-400">Cash, card, GCash, Maya, bank transfer, split tender.</p>
      </section>
      <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h2 className="font-semibold">Receipt</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Printed from the POS pay drawer with venue name, table, order number, tax, and tender.
        </p>
      </section>
      <button
        type="button"
        className="h-11 rounded-xl border border-rose-400/40 px-4 text-sm text-rose-200"
        onClick={() => void run(() => api.act({ type: "reset" }))}
      >
        Reset demo data
      </button>
    </div>
  );
}
