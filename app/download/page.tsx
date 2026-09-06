import type { Metadata } from "next";
import { Logo } from "@/components/club/logo";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { DownloadPanels } from "@/components/site/download-panels";

export const metadata: Metadata = {
  title: "Download 199X POS",
  description: "Download the 199X Coffee+Bar POS app for Android and iPhone.",
};

export default function DownloadPage() {
  return (
    <div className="kada-pattern min-h-dvh bg-black text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto max-w-[16rem] sm:max-w-sm">
            <Logo size="login" />
          </div>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-kada-green sm:text-xs sm:tracking-[0.24em]">
            August 2026
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Download the app</h1>
          <p className="font-script text-xl text-kada-yellow sm:text-2xl">Coffee+Bar POS</p>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Install on Android phones and iPhone. After install, open the app and enter your 4-digit staff PIN.
          </p>
        </div>
        <div className="mt-8 sm:mt-10">
          <DownloadPanels />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
