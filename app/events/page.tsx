import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SitePage } from "@/components/site/ui";
import { events } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Events",
  description: "Weekly nights and special dates at 199X Coffee+Bar in Davao City.",
};

export default function EventsPage() {
  return (
    <SitePage>
      <PageHero
        kicker="Calendar"
        title="Events"
        script="Nights at 199X"
        body="Weekly gold hour, Saturday live sets, Sunday coffee, and festival takeovers. Reserve a table or take the room."
      />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className={`rounded-3xl border bg-black/60 p-5 sm:p-6 ${event.color}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">{event.tag}</p>
                  <h2 className="mt-2 text-2xl font-extrabold">{event.title}</h2>
                </div>
                <p className="shrink-0 text-right text-xs font-semibold text-kada-yellow">
                  {event.date}
                  <span className="mt-1 block text-zinc-400">{event.time}</span>
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{event.body}</p>
              <Link
                href={`/booking?event=${event.id}`}
                className="mt-5 inline-flex h-11 items-center rounded-2xl bg-kada-yellow px-4 text-sm font-extrabold text-black"
              >
                Book this event
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
