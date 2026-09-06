"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppInstall } from "@/components/site/app-install";

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
      <path d="M16.7 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.1-.8c-1.6.1-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.6-3.9zM14.6 5.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3z" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
      <path d="M4 3.5v17l13.2-8.5L4 3.5zm14.3 6.3-2.6 1.7 2.6 1.7c.8.5 1.7 0 1.7-.9v-1.6c0-.9-.9-1.4-1.7-.9z" />
    </svg>
  );
}

export function StoreButtons({ size = "lg" }: { size?: "lg" | "sm" }) {
  const { platform, installed, canPrompt, install } = useAppInstall();
  const pad = size === "lg" ? "px-5 py-4" : "px-4 py-3";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/download#android"
        onClick={async (event) => {
          if (platform === "android" && canPrompt) {
            event.preventDefault();
            await install();
          }
        }}
        className={`flex min-w-[220px] items-center gap-3 rounded-2xl bg-kada-green ${pad} font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:brightness-110`}
      >
        <PlayMark />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em]">
            {installed && platform === "android" ? "Installed on" : "Download for"}
          </span>
          <span className="text-lg">Android</span>
        </span>
      </Link>
      <Link
        href="/download#ios"
        className={`flex min-w-[220px] items-center gap-3 rounded-2xl bg-white ${pad} font-bold text-black hover:bg-zinc-100`}
      >
        <AppleMark />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em]">
            {installed && platform === "ios" ? "Installed on" : "Download for"}
          </span>
          <span className="text-lg">iPhone</span>
        </span>
      </Link>
    </div>
  );
}

export function DownloadQr() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/download`;
    setSrc(
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=000000&color=22c55e&qzone=2&data=${encodeURIComponent(url)}`,
    );
  }, []);

  if (!src) return <div className="h-[220px] w-[220px] rounded-2xl bg-white/5" />;

  return (
    <img
      src={src}
      alt="QR code to download the 199X POS app"
      width={220}
      height={220}
      className="rounded-2xl border border-kada-green/40 bg-black p-2"
    />
  );
}
