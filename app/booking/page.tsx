import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/site/booking-form";
import { PageHero, SitePage } from "@/components/site/ui";
import { venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Booking",
  description: "Reserve a table, event night, or private buyout at 199X Coffee+Bar.",
};

export default function BookingPage() {
  return (
    <SitePage>
      <PageHero
        kicker="Reservations"
        title="Book 199X"
        script="Hold the table"
        body="Tables, event nights, and private buyouts. We confirm by phone. Walk-ins still welcome at the bar."
      />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <Suspense fallback={<div className="h-80 rounded-3xl bg-white/5" />}>
          <BookingForm />
        </Suspense>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kada-yellow">Visit</p>
            <p className="mt-3 text-lg font-extrabold">{venue.address}</p>
            <p className="mt-2 text-sm text-zinc-400">{venue.phone}</p>
            <p className="text-sm text-zinc-400">{venue.email}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kada-green">Hours</p>
            <ul className="mt-4 space-y-3 text-sm">
              {venue.hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-3">
                  <span className="text-zinc-400">{row.days}</span>
                  <span className="text-white">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-kada-yellow">Happy hour {venue.happyHour}</p>
          </div>
        </aside>
      </section>
    </SitePage>
  );
}
