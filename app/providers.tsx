"use client";

import type { ReactNode } from "react";
import WalletProviders from "@/components/WalletProviders";

export function Providers({ children }: { children: ReactNode }) {
  return <WalletProviders>{children}</WalletProviders>;
}
