"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [WalletProviders, setWalletProviders] = useState<ComponentType<{ children: ReactNode }> | null>(null);
  useEffect(() => { let active = true; import("@/components/WalletProviders").then(module => { if (active) setWalletProviders(() => module.default); }); return () => { active = false; }; }, []);
  return WalletProviders ? <WalletProviders>{children}</WalletProviders> : children;
}
