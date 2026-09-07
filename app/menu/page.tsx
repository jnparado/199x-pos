import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SitePage } from "@/components/site/ui";
import { menu } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Menu",
  description: "Coffee, cocktails, beer, whiskey, wine, and bar food at 199X Coffee+Bar.",
};

export default function MenuPage() {
  return (
    <SitePage>
      <PageHero
        kicker="The list"
        title="Menu"
        script="Coffee + bar"
        body="Prices in Philippine pesos. Happy hour 5–7 PM on marked drinks. Kitchen until late on Friday and Saturday."
      />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          {menu.map((group) => (
            <article key={group.id} className="rounded-3xl border border-white/10 bg-black/60 p-5 sm:p-6">
              <h2 className={`text-2xl font-extrabold ${group.color}`}>{group.name}</h2>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span>
                      <span className="block font-semibold text-white">{item.name}</span>
                      {item.note ? <span className="text-xs text-zinc-500">{item.note}</span> : null}
                    </span>
                    <span className="shrink-0 font-extrabold text-kada-yellow">₱{item.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className="inline-flex h-12 items-center rounded-2xl bg-kada-yellow px-6 text-sm font-extrabold text-black"
          >
            Book a table
          </Link>
        </div>
      </section>
    </SitePage>
  );
}
