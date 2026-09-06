import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/club/logo";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { StoreButtons } from "@/components/site/store-buttons";

export const metadata: Metadata = {
  title: "199X Coffee+Bar POS",
  description: "Coffee and bar point of sale for 199X Coffee+Bar. Download the Android and iPhone app, or open the register in your browser.",
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
        <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:gap-10 sm:py-14 lg:grid-cols-2 lg:py-20">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-kada-green sm:text-xs sm:tracking-[0.28em]">
              August 2026 · Davao City
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">199X</span>
              <span className="font-script mt-1 block text-3xl text-kada-yellow sm:text-4xl lg:mt-0 lg:inline lg:ml-3 lg:text-5xl">
                Coffee+Bar
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300 sm:text-lg lg:mx-0">
              The coffee and bar POS for the floor. Take orders, run tabs, and close the night from a phone, tablet, or counter.
            </p>
            <div className="mt-6 sm:mt-8">
              <StoreButtons />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold lg:justify-start">
              <Link href="/login" className="text-kada-yellow hover:underline">
                Open POS in browser
              </Link>
              <span className="text-zinc-600">·</span>
              <Link href="/#features" className="text-zinc-400 hover:text-white">
                See what it does
              </Link>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <Logo size="hero" />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-12 sm:pb-16">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-kada-blue sm:text-xs sm:tracking-[0.22em]">
            Built for the club
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Everything the floor needs</h2>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-white/10 bg-black/55 p-4 sm:rounded-3xl sm:p-5">
                <h3 className={`text-base font-extrabold sm:text-lg ${feature.color}`}>{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/70">
          <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-6 px-4 py-10 sm:py-14 md:flex-row md:items-center">
            <div className="text-center md:text-left">
              <p className="font-script text-3xl text-kada-yellow">Get the app</p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400 sm:text-base md:mx-0">
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
