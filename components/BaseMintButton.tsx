"use client";

import { useState, type ComponentType, type ReactNode } from "react";
interface MintBundle { Button: ComponentType<{ seedHash: string }>; Provider: ComponentType<{ children: ReactNode }>; }
export function BaseMintButton({ seedHash }: { seedHash: string }) {
  const [bundle, setBundle] = useState<MintBundle | null>(null); const [loading, setLoading] = useState(false);
  const load = async () => { setLoading(true); try { const [providerModule, buttonModule] = await Promise.all([import("./WalletProviders"), import("./BaseMintButtonInner")]); setBundle({ Provider: providerModule.default, Button: buttonModule.default }); } finally { setLoading(false); } };
  if (bundle) { const Provider = bundle.Provider; const Button = bundle.Button; return <Provider><Button seedHash={seedHash} /></Provider>; }
  return <button className="primary-button" onClick={load} disabled={loading}>{loading ? "Preparing Base mint…" : "Mint on Base"}<span>↗</span></button>;
}
