"use client";

import { useEffect, useState, type ComponentType } from "react";

export function WalletButton() {
  const [Button, setButton] = useState<ComponentType | null>(null);
  useEffect(() => { let active = true; import("./WalletButtonInner").then(module => { if (active) setButton(() => module.default); }); return () => { active = false; }; }, []);
  return Button ? <Button /> : <button className="wallet-button" disabled>Connect wallet</button>;
}
