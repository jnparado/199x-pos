import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SitePage } from "@/components/site/ui";
import { venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hours, address, and contact for 199X Coffee+Bar in Davao City.",
};

export default function ContactPage() {
  return (
    <SitePage>
      <PageHero
        kicker="Visit"
        title="Contact"
        script="Come through"
        body="Downtown Davao. Coffee from 10. Bar until late. Call, message, or book a table online."
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-black/60 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kada-yellow">Address</p>
          <p className="mt-3 text-xl font-extrabold">{venue.address}</p>
          <p className="mt-4 text-sm text-zinc-400">{venue.phone}</p>
          <p className="text-sm text-zinc-400">{venue.email}</p>
          <a
            href={`mailto:${venue.email}`}
            className="mt-6 inline-flex h-11 items-center rounded-2xl border border-white/15 px-4 text-sm font-extrabold"
          >
            Email the house
          </a>
        </article>
        <article className="rounded-3xl border border-white/10 bg-black/60 p-6">
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
          <Link
            href="/booking"
            className="mt-6 inline-flex h-11 items-center rounded-2xl bg-kada-yellow px-4 text-sm font-extrabold text-black"
          >
            Reserve a table
          </Link>
        </article>
      </section>
    </SitePage>
  );
}
