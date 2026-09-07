"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function linkClass(active: boolean, mobile = false) {
  if (mobile) {
    return `rounded-2xl px-4 py-3 text-base font-semibold ${
      active ? "bg-kada-yellow text-black" : "bg-white/5 text-white"
    }`;
  }
  return `rounded-full px-3 py-2 ${active ? "text-kada-yellow" : "text-zinc-300 hover:text-white"}`;
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-1 text-sm font-semibold xl:flex">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass(pathname === link.href)}>
            {link.label}
          </Link>
        ))}
        <Link
          href="/booking"
          className="ml-1 rounded-full bg-kada-yellow px-4 py-2 font-extrabold text-black hover:brightness-110"
        >
          Reserve
        </Link>
        <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-white hover:bg-white/5">
          Staff
        </Link>
      </nav>

      <div className="flex items-center gap-1.5 xl:hidden">
        <Link
          href="/booking"
          className="rounded-full bg-kada-yellow px-3 py-2 text-xs font-extrabold text-black"
        >
          Reserve
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-black/95 p-3 xl:hidden">
          <div className="grid gap-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClass(pathname === link.href, true)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className={linkClass(pathname === "/login", true)}>
              Staff login
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
