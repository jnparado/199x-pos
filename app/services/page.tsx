import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SitePage } from "@/components/site/ui";
import { services, venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Services",
  description: "Coffee, cocktails, kitchen, private events, and group bookings at 199X Coffee+Bar.",
};

export default function ServicesPage() {
  return (
    <SitePage>
      <PageHero
        kicker="The house"
        title="Services"
        script="Coffee + bar"
        body="Day service, night service, and the room you can close. Tell us the occasion and we set the tab."
      />
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="rounded-3xl border border-white/10 bg-black/60 p-5 sm:p-6">
              <h2 className={`text-2xl font-extrabold ${service.color}`}>{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{service.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-kada-yellow">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-kada-yellow/40 bg-black/70 p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-script text-3xl text-kada-yellow">Private nights</p>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              VIP room or full buyout. {venue.happyHour} is already on the board if you want the room before the set.
            </p>
          </div>
          <Link
            href="/booking"
            className="mt-5 inline-flex h-12 items-center rounded-2xl bg-kada-yellow px-6 text-sm font-extrabold text-black sm:mt-0"
          >
            Plan an event
          </Link>
        </div>
      </section>
    </SitePage>
  );
}
