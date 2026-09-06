import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/club/logo";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { StoreButtons } from "@/components/site/store-buttons";

export const metadata: Metadata = {
  title: "199X Kadayawan POS",
  description: "Bar point of sale for 199X Kadayawan. Download the Android and iPhone app, or open the register in your browser.",
};

const FEATURES = [
  { color: "text-kada-green", title: "Fast register", body: "Sell beer, cocktails, shots, and food with happy hour prices built in." },
  { color: "text-kada-blue", title: "Tables and tabs", body: "Seat the floor, open bar tabs, transfer, merge, and assign waiters." },
  { color: "text-kada-red", title: "Bar display", body: "Send tickets to the bar. New, preparing, ready, served." },
  { color: "text-kada-yellow", title: "Inventory", body: "Track bottles and recipes so a Mojito deducts rum, lime, syrup, and mint." },
  { color: "text-kada-orange", title: "Staff PINs", body: "Owner, manager, cashier, bartender, and server each keep their own PIN." },
  { color: "text-kada-green", title: "PHP payments", body: "Cash, card, GCash, and Maya with 12% tax and 10% service." },
];

export default function LandingPage() {
  return (
    <div className="kada-pattern min-h-dvh bg-black text-white">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-kada-green">
              August 2026 · Davao City
            </p>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
              199X
              <span className="font-script ml-3 text-4xl text-kada-yellow sm:text-5xl">Kadayawan</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-300">
              The bar POS for the festival floor. Take orders, run tabs, and close the night from a phone, tablet, or counter.
            </p>
            <div className="mt-8">
              <StoreButtons />
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/login" className="text-kada-yellow hover:underline">
                Open POS in browser
              </Link>
              <span className="text-zinc-600">·</span>
              <Link href="/#features" className="text-zinc-400 hover:text-white">
                See what it does
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/70 p-4 shadow-[0_0_80px_rgba(37,99,235,0.18)]">
            <Logo size="hero" />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 pb-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-kada-blue">Built for the club</p>
          <h2 className="mt-2 text-3xl font-extrabold">Everything the floor needs</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-3xl border border-white/10 bg-black/55 p-5">
                <h3 className={`text-lg font-extrabold ${feature.color}`}>{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/70">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
            <div>
              <p className="font-script text-3xl text-kada-yellow">Get the app</p>
              <p className="mt-2 max-w-xl text-zinc-400">
                Download 199X POS for Android and iPhone, then sign in with your staff PIN.
              </p>
            </div>
            <StoreButtons size="sm" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
