import Link from "next/link";
import { Logo } from "@/components/club/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Logo size="mark" />
          <span className="hidden min-w-0 min-[420px]:block">
            <span className="block truncate text-xs font-extrabold tracking-tight text-white sm:text-sm">
              199X POS
            </span>
            <span className="font-script text-kada-yellow">Coffee+Bar</span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
          <Link
            href="/#features"
            className="hidden rounded-full px-3 py-2 text-zinc-300 hover:text-white md:inline"
          >
            Features
          </Link>
          <Link
            href="/download"
            className="rounded-full bg-kada-green px-3 py-2 text-black hover:brightness-110 sm:px-4"
          >
            <span className="sm:hidden">Get app</span>
            <span className="hidden sm:inline">Get the app</span>
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-3 py-2 text-white hover:bg-white/5 sm:px-4"
          >
            <span className="sm:hidden">Login</span>
            <span className="hidden sm:inline">Staff login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>199X Coffee+Bar POS · Davao City · August 2026</p>
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
