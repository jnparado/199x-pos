import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/club/logo";
import { GoldRule, SitePage } from "@/components/site/ui";
import { events, menu, services, venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "199X Coffee+Bar",
  description: "Coffee by day. Bar after dark. 199X Coffee+Bar in downtown Davao City.",
};

export default function HomePage() {
  return (
    <SitePage>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-20">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-kada-green sm:text-xs sm:tracking-[0.28em]">
            {venue.city} · Coffee+Bar
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            199X
          </h1>
          <p className="font-script mt-2 text-4xl text-kada-yellow sm:text-5xl">Coffee+Bar</p>
          <GoldRule label="Davao" />
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg lg:mx-0">
            A black room, a gold rim, and a floor that moves from espresso to last call. Come for coffee. Stay for the night.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-kada-yellow px-6 text-sm font-extrabold text-black hover:brightness-110"
            >
              Book a table
            </Link>
            <Link
              href="/menu"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/15 px-6 text-sm font-extrabold text-white hover:bg-white/5"
            >
              View menu
            </Link>
          </div>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <Logo size="hero" />
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/60">
        <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-4">
          {[
            { n: "1", c: "text-kada-green", t: "Coffee first" },
            { n: "9", c: "text-kada-blue", t: "Long tabs" },
            { n: "9", c: "text-kada-red", t: "Late close" },
            { n: "X", c: "text-kada-yellow", t: "Davao nights" },
          ].map((item) => (
            <div key={item.t} className="bg-black px-4 py-6 text-center">
              <p className={`text-4xl font-extrabold ${item.c}`}>{item.n}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <GoldRule label="The room" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">One address. Two tempos.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Mornings are pour-overs and quiet tables. After 5, the lights drop, happy hour starts, and the bar takes the floor. Same staff. Same 199X mark on the door.
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              We keep a short kitchen, a full cocktail list, and a VIP room when the night needs a door that closes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {venue.hours.map((row) => (
              <article key={row.days} className="rounded-2xl border border-white/10 bg-black/55 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-kada-yellow">{row.days}</p>
                <p className="mt-2 text-sm text-white">{row.time}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-kada-yellow/40 bg-black/55 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-kada-green">Happy hour</p>
              <p className="mt-2 text-sm text-white">{venue.happyHour}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kada-green">Menu</p>
            <h2 className="mt-2 text-3xl font-extrabold">Coffee, pours, and plates</h2>
          </div>
          <Link href="/menu" className="hidden text-sm font-semibold text-kada-yellow sm:inline">
            Full menu
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {menu.slice(0, 3).map((group) => (
            <article key={group.id} className="rounded-3xl border border-white/10 bg-black/55 p-5">
              <h3 className={`text-lg font-extrabold ${group.color}`}>{group.name}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {group.items.slice(0, 4).map((item) => (
                  <li key={item.name} className="flex justify-between gap-3 text-zinc-300">
                    <span>{item.name}</span>
                    <span className="text-kada-yellow">₱{item.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link href="/menu" className="mt-6 block text-center text-sm font-semibold text-kada-yellow sm:hidden">
          Full menu
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kada-blue">Calendar</p>
            <h2 className="mt-2 text-3xl font-extrabold">Nights worth booking</h2>
          </div>
          <Link href="/events" className="hidden text-sm font-semibold text-kada-yellow sm:inline">
            All events
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <article key={event.id} className={`rounded-3xl border bg-black/55 p-5 ${event.color}`}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">{event.tag}</p>
              <h3 className="mt-2 text-xl font-extrabold">{event.title}</h3>
              <p className="mt-1 text-sm text-kada-yellow">{event.date} · {event.time}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{event.body}</p>
              <Link href={`/booking?event=${event.id}`} className="mt-4 inline-block text-sm font-semibold text-white hover:text-kada-yellow">
                Reserve this night
              </Link>
            </article>
          ))}
        </div>
        <Link href="/events" className="mt-6 block text-center text-sm font-semibold text-kada-yellow sm:hidden">
          All events
        </Link>
      </section>

      <section className="border-y border-white/10 bg-black/70">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kada-red">What we do</p>
          <h2 className="mt-2 text-3xl font-extrabold">Coffee, bar, and the room between</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <article key={service.id} className="rounded-3xl border border-white/10 bg-black/55 p-5">
                <h3 className={`text-lg font-extrabold ${service.color}`}>{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{service.body}</p>
              </article>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-8 inline-flex h-12 items-center rounded-2xl border border-white/15 px-5 text-sm font-extrabold hover:bg-white/5"
          >
            View services
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <GoldRule label="Reserve" />
        <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">Hold a table before the room fills</h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-400">
          Walk-ins are welcome. Reservations get a server, a tab, and a seat that stays yours.
        </p>
        <Link
          href="/booking"
          className="mt-8 inline-flex h-12 items-center rounded-2xl bg-kada-yellow px-8 text-sm font-extrabold text-black hover:brightness-110"
        >
          Book 199X
        </Link>
      </section>
    </SitePage>
  );
}
