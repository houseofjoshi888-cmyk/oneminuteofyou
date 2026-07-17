"use client";
import Link from "next/link";
import { useCallback, useState, type CSSProperties } from "react";
import { Recorder } from "@/components/Recorder";
import { Renderer } from "@/components/Renderer";
import { Stats } from "@/components/Stats";
import { analyzeRecording, type InteractionFeatures } from "@/lib/analyzer";
import { seedFromFeatures } from "@/lib/seed";
import type { Recording } from "@/lib/recorder";
import { artworkName, compositionName } from "@/lib/export";
import { royalHouseFromWords, royalRarity } from "@/lib/houses";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }

export default function GeneratePage() {
  const [result, setResult] = useState<Result | null>(null);
  const complete = useCallback(async (recording: Recording) => {
    const features = analyzeRecording(recording); const seed = await seedFromFeatures(features); const value = { features, ...seed };
    sessionStorage.setItem("one-minute-result", JSON.stringify(value)); setResult(value);
  }, []);
  const house = result ? royalHouseFromWords(result.words) : null; const rarity = result ? royalRarity(result.hash, result.features.coverage + result.features.directionEntropy + result.features.pressureMean) : null;
  return <main className={result ? "result-page" : "studio"} style={house ? { "--house-primary": house.primary, "--house-secondary": house.secondary } as CSSProperties : undefined}>
    <nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><span className="nav-note">{result ? "YOUR DETERMINISTIC PORTRAIT" : "60 SECONDS · PRIVATE · LOCAL"}</span></nav>
    {!result ? <Recorder onComplete={complete} /> : <div className="result-grid"><Renderer words={result.words} features={result.features} /><section className="result-copy"><p className="eyebrow"><span /> {house?.name.toUpperCase()} · {compositionName(result.hash).toUpperCase()}</p><h2>{artworkName(result.hash, result.features)}<br /><em>enters {house?.name}.</em></h2><p className="mint-note">Your minute was welcomed into {house?.name}, where {house?.motto.toLowerCase()}. Its {house?.ornament} ornament, {house?.gemstone} palette, and {rarity?.tier.toLowerCase()} rank are fixed forever by the seed.</p><div className="royal-house-card"><span className="house-gem">◆</span><div><small>ROYAL HOUSE</small><strong>{house?.name}</strong><em>{house?.motto}</em></div><b>{rarity?.tier}<small>RANK {rarity?.score}</small></b></div><div className="hash">SHA-256 / {result.hash}</div><Stats features={result.features} /><div className="result-actions"><Link className="primary-button" href="/mint">Prepare royal edition <span>↗</span></Link><button className="secondary-button" onClick={() => setResult(null)}>Record again</button></div></section></div>}
  </main>;
}
