"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Renderer } from "@/components/Renderer";
import { Stats } from "@/components/Stats";
import type { InteractionFeatures } from "@/lib/analyzer";
import { artworkName, createMetadata, exportMetadata, exportPng } from "@/lib/export";
import { renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { DEFAULT_SIMULATION, simulateParticles } from "@/lib/simulation";
import { royalHouseFromWords, royalRarity } from "@/lib/houses";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }
export default function MintPage() {
  const [result, setResult] = useState<Result | null>(null); const [exporting, setExporting] = useState(false);
  useEffect(() => { const stored = sessionStorage.getItem("one-minute-result"); if (!stored) return; const id = window.setTimeout(() => setResult(JSON.parse(stored) as Result), 0); return () => clearTimeout(id); }, []);
  const metadata = useMemo(() => result ? createMetadata(result.hash, result.features, DEFAULT_SIMULATION) : null, [result]);
  const highRes = useCallback(() => { if (!result) return; setExporting(true); requestAnimationFrame(() => { const canvas = document.createElement("canvas"); const frame = simulateParticles(result.words, result.features, DEFAULT_SIMULATION); renderArtwork(canvas, frame, renderConfigForHouse(result.words)); exportPng(canvas, `one-minute-${result.hash.slice(0, 8)}-4096.png`); setExporting(false); }); }, [result]);
  if (!result) return <main className="result-page"><nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link></nav><section className="result-copy" style={{maxWidth:620,margin:"12vh auto"}}><p className="eyebrow"><span /> NO PORTRAIT FOUND</p><h2>Your minute<br /><em>awaits.</em></h2><p className="mint-note">Record a minute first. Your portrait and metadata stay only in this browser session.</p><Link className="primary-button" href="/generate">Begin recording <span>↗</span></Link></section></main>;
  const title = artworkName(result.hash, result.features);
  const house = royalHouseFromWords(result.words); const rarity = royalRarity(result.hash, result.features.coverage + result.features.directionEntropy + result.features.pressureMean);
  return <main className="result-page" style={{ "--house-primary": house.primary, "--house-secondary": house.secondary } as CSSProperties}><nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><span className="nav-note">{house.name.toUpperCase()} / {result.hash.slice(0, 8).toUpperCase()}</span></nav><div className="result-grid"><Renderer words={result.words} features={result.features} /><section className="result-copy"><p className="eyebrow"><span /> ONE MINUTE OF YOU · ROYAL HOUSES</p><h2>{title}<br /><em>of {house.name}.</em></h2><p className="mint-note">This one-of-one carries the colors, naming language, {house.ornament} ornament, and {house.gemstone} seal of {house.name}. Its royal traits are encoded in the NFT metadata.</p><div className="royal-house-card"><span className="house-gem">◆</span><div><small>ROYAL HOUSE</small><strong>{house.name}</strong><em>{house.motto}</em></div><b>{rarity.tier}<small>RANK {rarity.score}</small></b></div><div className="nft-badge"><span>COLLECTION</span><strong>One Minute of You: Royal Houses</strong><i>1 / 1 · {result.hash.slice(0, 8).toUpperCase()}</i></div><Stats features={result.features} /><div className="result-actions"><button className="primary-button" onClick={highRes} disabled={exporting}>{exporting ? "Rendering royal NFT…" : "Export royal artwork"}<span>↓</span></button><button className="secondary-button" onClick={() => metadata && exportMetadata(metadata, `${title.toLowerCase().replaceAll(" ", "-")}-${result.hash.slice(0, 8)}.json`)}>Royal metadata</button></div><pre className="metadata">{JSON.stringify(metadata, null, 2)}</pre></section></div></main>;
}
