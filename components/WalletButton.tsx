"use client";

import { useState, type ComponentType, type ReactNode } from "react";

interface WalletBundle {
  Button: ComponentType;
  Provider: ComponentType<{ children: ReactNode }>;
}

export function WalletButton() {
  const [bundle, setBundle] = useState<WalletBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const enableWallet = async () => {
    setLoading(true); setError(false);
    try {
      const [providerModule, buttonModule] = await Promise.all([import("./WalletProviders"), import("./WalletButtonInner")]);
      setBundle({ Provider: providerModule.default, Button: buttonModule.default });
    } catch { setError(true); } finally { setLoading(false); }
  };
  if (bundle) { const Provider = bundle.Provider; const Button = bundle.Button; return <Provider><Button /></Provider>; }
  return <button className={`wallet-button${error ? " wallet-warning" : ""}`} onClick={enableWallet} disabled={loading}>{loading ? "Loading wallet…" : error ? "Retry wallet" : "Connect wallet"}<span>{error ? "!" : "◆"}</span></button>;
}
