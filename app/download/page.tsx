import type { Metadata } from "next";
import { Logo } from "@/components/club/logo";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { DownloadPanels } from "@/components/site/download-panels";

export const metadata: Metadata = {
  title: "Download 199X POS",
  description: "Download the 199X Kadayawan POS app for Android and iPhone.",
};

export default function DownloadPage() {
  return (
    <div className="kada-pattern min-h-dvh bg-black text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <Logo size="login" />
          <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.24em] text-kada-green">
            August 2026
          </p>
          <h1 className="mt-2 text-4xl font-extrabold">Download the app</h1>
          <p className="font-script text-2xl text-kada-yellow">Kadayawan POS</p>
          <p className="mt-3 text-zinc-400">
            Install on Android phones and iPhone. After install, open the app and enter your 4-digit staff PIN.
          </p>
        </div>
        <div className="mt-10">
          <DownloadPanels />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
