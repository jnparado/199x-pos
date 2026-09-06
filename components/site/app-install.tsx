"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type DevicePlatform = "android" | "ios" | "desktop";

type AppInstallValue = {
  platform: DevicePlatform;
  installed: boolean;
  canPrompt: boolean;
  install: () => Promise<boolean>;
};

const AppInstallContext = createContext<AppInstallValue | null>(null);

function detectPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function AppInstallProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<DevicePlatform>("desktop");
  const [installed, setInstalled] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" });
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    if (choice.outcome === "accepted") setInstalled(true);
    return choice.outcome === "accepted";
  }, [promptEvent]);

  const value = useMemo(
    () => ({
      platform,
      installed,
      canPrompt: Boolean(promptEvent),
      install,
    }),
    [platform, installed, promptEvent, install],
  );

  return createElement(AppInstallContext.Provider, { value }, children);
}

export function useAppInstall() {
  const ctx = useContext(AppInstallContext);
  if (!ctx) throw new Error("useAppInstall must be used inside AppInstallProvider");
  return ctx;
}
