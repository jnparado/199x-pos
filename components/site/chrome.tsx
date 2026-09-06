import Link from "next/link";
import { Logo } from "@/components/club/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="mark" />
          <span className="hidden sm:block">
            <span className="block text-sm font-extrabold tracking-tight text-white">199X POS</span>
            <span className="font-script text-kada-yellow">Kadayawan</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/#features" className="hidden rounded-full px-3 py-2 text-zinc-300 hover:text-white md:inline">
            Features
          </Link>
          <Link href="/download" className="rounded-full bg-kada-green px-4 py-2 text-black hover:brightness-110">
            Get the app
          </Link>
          <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-white hover:bg-white/5">
            Staff login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>199X Kadayawan POS · Davao City · August 2026</p>
        <div className="flex gap-4">
          <Link href="/download" className="hover:text-kada-green">
            Download
          </Link>
          <Link href="/login" className="hover:text-kada-yellow">
            Open POS
          </Link>
        </div>
      </div>
    </footer>
  );
}
