"use client";

import { ClubProvider } from "@/lib/club/use-club";
import { AppInstallProvider } from "@/components/site/app-install";
import { Shell } from "./shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClubProvider>
      <AppInstallProvider>
        <Shell>{children}</Shell>
      </AppInstallProvider>
    </ClubProvider>
  );
}
