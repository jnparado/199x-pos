"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/club/logo";
import { useClub } from "@/lib/club/use-club";
import { isMarketingPath, isPublicPath } from "@/lib/site";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pos", label: "POS" },
  { href: "/tables", label: "Tables" },
  { href: "/products", label: "Products" },
  { href: "/inventory", label: "Inventory" },
  { href: "/staff", label: "Staff" },
  { href: "/bar", label: "Bar display" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout, error, busy, state } = useClub();

  useEffect(() => {
    if (!ready) return;
    if (isMarketingPath(pathname)) return;
    if (!user && pathname !== "/login") router.replace("/login");
    if (user && pathname === "/login") router.replace("/dashboard");
  }, [pathname, ready, router, user]);

  if (isPublicPath(pathname)) return <>{children}</>;

  return (
    <div className="flex h-dvh overflow-hidden bg-black text-zinc-100">
      <aside className="kada-pattern hidden w-60 shrink-0 flex-col border-r border-white/10 bg-black md:flex">
        <div className="border-b border-white/10 px-4 py-4">
          <Logo size="nav" />
          <p className="font-script mt-2 text-center text-lg text-kada-yellow">
            Kadayawan
          </p>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-kada-green">
            August 2026
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-2 text-sm font-semibold ${
                pathname === item.href
                  ? "bg-kada-green text-black"
                  : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-xs text-zinc-400">
          {user ? `${user.name} · ${user.role}` : "Not signed in"}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-white/10 bg-black/80 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <Logo size="mark" />
            <span className="font-script text-kada-yellow">Kadayawan</span>
          </div>
          <div className="flex gap-2 overflow-x-auto md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  pathname === item.href
                    ? "bg-kada-green text-black"
                    : "bg-white/5 text-zinc-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="hidden text-sm font-medium text-zinc-400 lg:block">
            {state?.venue.city || "Davao City"}
            {busy ? " · Saving…" : ""}
          </p>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-zinc-300 sm:inline">
              {user ? `User: ${user.name}` : "Guest"}
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="h-9 rounded-xl border border-kada-red/50 px-3 text-sm font-semibold text-kada-red"
            >
              Logout
            </button>
          </div>
        </header>
        {error ? (
          <div className="bg-kada-red/15 px-4 py-2 text-sm text-red-100">{error}</div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
