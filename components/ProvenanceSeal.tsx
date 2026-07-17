"use client";

import { useEffect, useRef } from "react";
import { drawProvenanceSeal } from "@/lib/provenance";

export function ProvenanceSeal({ hash, primary, secondary }: { hash: string; primary: string; secondary: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) drawProvenanceSeal(ref.current, hash, primary, secondary); }, [hash, primary, secondary]);
  return <div className="provenance-seal"><canvas ref={ref} aria-label={`SHA-256 provenance seal ${hash.slice(0, 8)}`} /><div><small>PROVENANCE SEAL</small><strong>{hash.slice(0, 8).toUpperCase()}</strong><span>Derived from every byte of the artwork seed</span></div></div>;
}
