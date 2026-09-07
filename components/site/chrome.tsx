import Link from "next/link";
import { Logo } from "@/components/club/logo";
import { SiteNav } from "./nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Logo size="mark" />
          <span className="min-w-0">
            <span className="block truncate text-xs font-extrabold tracking-tight text-white sm:text-sm">
              199X
            </span>
            <span className="font-script text-kada-yellow">Coffee+Bar</span>
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-sm font-extrabold text-white">199X Coffee+Bar</p>
          <p className="font-script mt-1 text-kada-yellow">Davao City</p>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Coffee by day. Bar after dark. Downtown Davao.
          </p>
        </div>
        <div className="text-sm text-zinc-400">
          <p className="font-extrabold text-white">Visit</p>
          <p className="mt-2">Downtown Davao City</p>
          <p>+63 82 123 199X</p>
          <p>hello@199x.bar</p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold">
          <Link href="/menu" className="text-zinc-300 hover:text-kada-yellow">
            Menu
          </Link>
          <Link href="/events" className="text-zinc-300 hover:text-kada-yellow">
            Events
          </Link>
          <Link href="/services" className="text-zinc-300 hover:text-kada-yellow">
            Services
          </Link>
          <Link href="/about" className="text-zinc-300 hover:text-kada-yellow">
            About
          </Link>
          <Link href="/contact" className="text-zinc-300 hover:text-kada-yellow">
            Contact
          </Link>
          <Link href="/booking" className="text-zinc-300 hover:text-kada-yellow">
            Book a table
          </Link>
        </div>
      </div>
    </footer>
  );
}
