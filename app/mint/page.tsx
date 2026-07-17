"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Renderer } from "@/components/Renderer";
import { Stats } from "@/components/Stats";
import type { InteractionFeatures } from "@/lib/analyzer";
import { createMetadata, exportMetadata, exportPng } from "@/lib/export";
import { DEFAULT_RENDER, renderArtwork } from "@/lib/renderer";
import { DEFAULT_SIMULATION, simulateParticles } from "@/lib/simulation";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }
export default function MintPage() {
  const [result, setResult] = useState<Result | null>(null); const [exporting, setExporting] = useState(false);
  useEffect(() => { const stored = sessionStorage.getItem("one-minute-result"); if (!stored) return; const id = window.setTimeout(() => setResult(JSON.parse(stored) as Result), 0); return () => clearTimeout(id); }, []);
  const metadata = useMemo(() => result ? createMetadata(result.hash, result.features, DEFAULT_SIMULATION) : null, [result]);
  const highRes = useCallback(() => { if (!result) return; setExporting(true); requestAnimationFrame(() => { const canvas = document.createElement("canvas"); const frame = simulateParticles(result.words, result.features, DEFAULT_SIMULATION); renderArtwork(canvas, frame, DEFAULT_RENDER); exportPng(canvas, `one-minute-${result.hash.slice(0, 8)}-4096.png`); setExporting(false); }); }, [result]);
  if (!result) return <main className="result-page"><nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link></nav><section className="result-copy" style={{maxWidth:620,margin:"12vh auto"}}><p className="eyebrow"><span /> NO PORTRAIT FOUND</p><h2>Your minute<br /><em>awaits.</em></h2><p className="mint-note">Record a minute first. Your portrait and metadata stay only in this browser session.</p><Link className="primary-button" href="/generate">Begin recording <span>↗</span></Link></section></main>;
  return <main className="result-page"><nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><span className="nav-note">EDITION / {result.hash.slice(0, 8).toUpperCase()}</span></nav><div className="result-grid"><Renderer words={result.words} features={result.features} /><section className="result-copy"><p className="eyebrow"><span /> READY TO COLLECT</p><h2>Keep the<br /><em>original.</em></h2><p className="mint-note">Export a museum-resolution 4096 × 4096 PNG generated from 100,000 particles, plus portable metadata containing the complete deterministic recipe.</p><Stats features={result.features} /><div className="result-actions"><button className="primary-button" onClick={highRes} disabled={exporting}>{exporting ? "Rendering edition…" : "Export 4K PNG"}<span>↓</span></button><button className="secondary-button" onClick={() => metadata && exportMetadata(metadata, `one-minute-${result.hash.slice(0, 8)}.json`)}>Metadata JSON</button></div><pre className="metadata">{JSON.stringify(metadata, null, 2)}</pre></section></div></main>;
}
