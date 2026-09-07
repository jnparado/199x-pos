import type { Metadata } from "next";
import Link from "next/link";
import { GoldRule, PageHero, SitePage } from "@/components/site/ui";
import { venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "About",
  description: "The story of 199X Coffee+Bar in downtown Davao City.",
};

export default function AboutPage() {
  return (
    <SitePage>
      <PageHero
        kicker="The house"
        title="About 199X"
        script="Coffee+Bar"
        body="A Davao room built for two clocks: espresso in the morning, last call after the set. Black walls, gold trim, and a floor that does not rush you out."
      />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <GoldRule label="Story" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-7 text-zinc-400">
            <p>
              199X opened as a coffee bar that refused to close when the sun did. The same counter that pulls Mindanao pour-overs at 10 AM pours whiskey after 10 PM.
            </p>
            <p>
              We keep the list short, the ice cold, and the VIP room ready when a night needs a door. Festival season, Friday gold hour, and quiet Sundays all use the same mark on the glass.
            </p>
            <p>
              {venue.city}. Walk in, or book ahead and the table stays yours.
            </p>
          </div>
          <div className="rounded-3xl border border-kada-yellow/40 bg-black/60 p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kada-yellow">House rules</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>Happy hour {venue.happyHour}</li>
              <li>Reservations held for 15 minutes</li>
              <li>Kitchen until midnight Friday and Saturday</li>
              <li>Private buyouts on request</li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center rounded-2xl border border-white/15 px-4 text-sm font-extrabold"
            >
              Find us
            </Link>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
