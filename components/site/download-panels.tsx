"use client";

import { useAppInstall } from "@/components/site/app-install";
import { DownloadQr } from "@/components/site/store-buttons";

export function DownloadPanels() {
  const { platform, installed, canPrompt, install } = useAppInstall();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section
        id="android"
        className={`rounded-3xl border bg-black/60 p-6 ${
          platform === "android" ? "border-kada-green shadow-[0_0_40px_rgba(34,197,94,0.15)]" : "border-white/10"
        }`}
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-kada-green">Android</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Download for Android</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Install 199X POS on your phone or tablet. Works on Chrome and other Android browsers.
        </p>
        {installed && platform === "android" ? (
          <p className="mt-4 rounded-2xl bg-kada-green/15 px-4 py-3 text-sm font-semibold text-kada-green">
            The app is already installed on this device.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void install()}
            className="mt-6 h-14 w-full rounded-2xl bg-kada-green text-base font-extrabold text-black hover:brightness-110"
          >
            {canPrompt ? "Install Android app" : "Use Chrome to install"}
          </button>
        )}
        <ol className="mt-6 space-y-3 text-sm text-zinc-300">
          <li>1. Open this site in Chrome on your Android phone.</li>
          <li>2. Tap <strong className="text-white">Install Android app</strong>, or open the Chrome menu and choose Add to Home screen.</li>
          <li>3. Open the 199X POS icon on your home screen and sign in with your staff PIN.</li>
        </ol>
      </section>

      <section
        id="ios"
        className={`rounded-3xl border bg-black/60 p-6 ${
          platform === "ios" ? "border-kada-yellow shadow-[0_0_40px_rgba(245,197,24,0.15)]" : "border-white/10"
        }`}
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-kada-yellow">iPhone</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Download for iPhone</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add the 199X POS app to your Home Screen. Use Safari for the fastest install.
        </p>
        <a
          href="/api/apps/ios"
          className="mt-6 flex h-14 items-center justify-center rounded-2xl bg-white text-base font-extrabold text-black hover:bg-zinc-100"
        >
          Download iPhone app
        </a>
        <ol className="mt-6 space-y-3 text-sm text-zinc-300">
          <li>1. On iPhone, tap <strong className="text-white">Download iPhone app</strong> and allow the configuration profile.</li>
          <li>2. Open Settings → Profile Downloaded → Install.</li>
          <li>
            3. Or in Safari: tap Share
            <span className="mx-1 inline-block rounded bg-kada-blue px-1.5 text-xs font-bold text-white">□↑</span>
            then <strong className="text-white">Add to Home Screen</strong>.
          </li>
        </ol>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/60 p-6 lg:col-span-2">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-kada-blue">Scan to install</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">Open this page on your phone</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Point your camera at the code. Android will offer the install button. iPhone will open the iOS download.
            </p>
          </div>
          <DownloadQr />
        </div>
      </section>
    </div>
  );
}
