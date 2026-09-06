"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { events } from "@/lib/venue";

const KINDS = [
  { id: "table", label: "Table" },
  { id: "event", label: "Event night" },
  { id: "private", label: "Private / buyout" },
] as const;

export function BookingForm() {
  const search = useSearchParams();
  const presetEvent = search.get("event") || "";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>(presetEvent ? "event" : "table");
  const [eventId, setEventId] = useState(presetEvent);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const selected = useMemo(() => events.find((item) => item.id === eventId), [eventId]);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          date,
          time,
          guests: Number(guests),
          kind,
          eventId: kind === "event" ? eventId : undefined,
          notes,
        }),
      });
      const data = (await response.json()) as { error?: string; booking?: { id: string } };
      if (!response.ok || !data.booking) throw new Error(data.error || "Booking failed");
      setDone(data.booking.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-kada-yellow/50 bg-black/70 p-6 text-center sm:p-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-kada-green">Request received</p>
        <h2 className="font-script mt-2 text-3xl text-kada-yellow">You are on the list</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          We will confirm {name}&apos;s {kind} for {guests} on {date} at {time}. Reference {done}.
        </p>
        {selected ? <p className="mt-2 text-sm text-white">{selected.title}</p> : null}
      </div>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-3xl border border-white/10 bg-black/70 p-4 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Phone">
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputClass} />
        </Field>
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputClass} />
        </Field>
        <Field label="Guests">
          <input required value={guests} onChange={(e) => setGuests(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Date">
          <input required value={date} onChange={(e) => setDate(e.target.value)} type="date" min="2026-09-06" className={inputClass} />
        </Field>
        <Field label="Time">
          <input required value={time} onChange={(e) => setTime(e.target.value)} type="time" className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setKind(item.id)}
            className={`h-11 rounded-xl text-xs font-extrabold sm:text-sm ${
              kind === item.id ? "bg-kada-yellow text-black" : "bg-white/6 text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {kind === "event" ? (
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className={inputClass}
        >
          <option value="">Choose an event</option>
          {events.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} · {item.date}
            </option>
          ))}
        </select>
      ) : null}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Occasion, allergies, or a preferred table"
        rows={4}
        className={`${inputClass} h-auto py-3`}
      />
      {error ? <p className="text-sm text-kada-red">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="h-12 rounded-2xl bg-kada-yellow text-sm font-extrabold text-black hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Request reservation"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-black/50 px-3 text-white outline-none focus:border-kada-yellow";
