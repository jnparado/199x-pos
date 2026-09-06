"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/club/logo";
import { useClub } from "@/lib/club/use-club";

export default function LoginPage() {
  const { login, state } = useClub();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(next = pin) {
    try {
      await login(next);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="kada-pattern flex min-h-dvh items-center justify-center bg-black px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/80 p-4 shadow-[0_0_80px_rgba(34,197,94,0.12)] sm:p-6">
        <Logo size="login" />
        <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-kada-green">
          August 2026
        </p>
        <h1 className="font-script mt-1 text-center text-3xl text-kada-yellow">
          Coffee+Bar POS
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          {state?.venue.city || "Davao City"}. Enter your 4-digit PIN.
        </p>
        <input
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          placeholder="••••"
          className="mt-6 h-14 w-full rounded-2xl border border-white/10 bg-black/50 text-center text-3xl font-bold tracking-[0.4em] text-white outline-none focus:border-kada-green"
        />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "→"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (key === "C") {
                  setPin("");
                  return;
                }
                if (key === "→") {
                  void submit();
                  return;
                }
                const next = (pin + key).slice(0, 4);
                setPin(next);
                if (next.length === 4) void submit(next);
              }}
              className={`h-14 rounded-2xl text-lg font-bold text-white ${
                key === "→"
                  ? "bg-kada-green text-black"
                  : key === "C"
                    ? "bg-kada-red/80"
                    : "bg-white/6 hover:bg-white/10"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        {error ? <p className="mt-3 text-sm text-kada-red">{error}</p> : null}
        <div className="mt-5 flex justify-center gap-4 text-xs font-semibold">
          <Link href="/" className="text-zinc-400 hover:text-white">
            Website
          </Link>
          <Link href="/download" className="text-kada-green hover:underline">
            Download app
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-zinc-500">
          {(state?.staff || []).map((staff) => (
            <p key={staff.id}>
              {staff.name} · {staff.pin}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
