import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./chrome";

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="kada-pattern min-h-dvh bg-black text-white">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function GoldRule({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-kada-yellow">
      <span className="h-px flex-1 bg-kada-yellow/50" />
      {label ? (
        <span className="text-[10px] font-extrabold uppercase tracking-[0.32em]">{label}</span>
      ) : null}
      <span className="h-px flex-1 bg-kada-yellow/50" />
    </div>
  );
}

export function PageHero({
  kicker,
  title,
  script,
  body,
}: {
  kicker: string;
  title: string;
  script?: string;
  body: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:pb-12 sm:pt-16">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-kada-green sm:text-xs">
        {kicker}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
      {script ? <p className="font-script mt-2 text-3xl text-kada-yellow sm:text-4xl">{script}</p> : null}
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{body}</p>
    </section>
  );
}
