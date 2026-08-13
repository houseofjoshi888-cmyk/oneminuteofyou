"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import type { ArtworkMetadata } from "@/lib/export";
interface MintProps { seedHash: string; metadata?: ArtworkMetadata; canvas?: HTMLCanvasElement | null; }
interface MintBundle { Button: ComponentType<MintProps>; Provider: ComponentType<{ children: ReactNode }>; }
export function BaseMintButton(props: MintProps) {
  const [bundle, setBundle] = useState<MintBundle | null>(null); const [loading, setLoading] = useState(false);
  const load = async () => { setLoading(true); try { const [providerModule, buttonModule] = await Promise.all([import("./WalletProviders"), import("./BaseMintButtonInner")]); setBundle({ Provider: providerModule.default, Button: buttonModule.default }); } finally { setLoading(false); } };
  if (bundle) { const Provider = bundle.Provider; const Button = bundle.Button; return <Provider><Button {...props} /></Provider>; }
  return <button className="primary-button" onClick={load} disabled={loading}>{loading ? "Preparing Base mint…" : "Mint on Base"}<span>↗</span></button>;
}
