"use client";
/* eslint-disable @next/next/no-img-element -- Static Sites deployment serves these local brand assets directly. */
import Link from "next/link";
import { useCallback, useState, type CSSProperties } from "react";
import { Recorder } from "@/components/Recorder";
import { LivingRenderer } from "@/components/LivingRenderer";
import { Stats } from "@/components/Stats";
import { ScienceSignature } from "@/components/ScienceSignature";
import { ProvenanceSeal } from "@/components/ProvenanceSeal";
import { CertificateShare } from "@/components/CertificateShare";
import { BaseMintButton } from "@/components/BaseMintButton";
import { SiteFooter } from "@/components/SiteFooter";
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
    <nav className="studio-nav studio-reference-nav">
      <Link className="studio-reference-brand" href="/"><img src="/one-minute-of-you-logo.png" alt=""/><span><strong>ONE MINUTE OF YOU</strong><small>THE ART OF PRESENCE. THE PROOF OF YOU.</small></span></Link>
      <ol className="studio-progress"><li>1 <span>PREPARE</span></li><li className={result ? "" : "active"}>2 <span>RECORD</span></li><li className={result ? "active" : ""}>3 <span>REVIEW</span></li></ol>
      <Link className="studio-exit" href="/">EXIT STUDIO <b>×</b></Link>
    </nav>
    {!result ? <Recorder onComplete={complete} /> : <><div className="result-grid protected-certificate" data-certificate={result.hash.slice(0,8).toUpperCase()} onContextMenu={event=>event.preventDefault()}><LivingRenderer words={result.words} features={result.features} /><section className="result-copy"><p className="eyebrow"><span /> YOUR ONE-OF-ONE NFT · {house?.name.toUpperCase()}</p><h2>{artworkName(result.hash, result.features)}<br /><em>of {house?.name}.</em></h2><p className="mint-note">Your final artwork is shown here immediately. Its House, composition, traits, and provenance are resolved from this movement seed.</p><div className="royal-house-card"><span className="house-gem">◆</span><div><small>ROYAL HOUSE · {compositionName(result.hash).toUpperCase()}</small><strong>{house?.name}</strong><em>{house?.motto}</em></div><b>{rarity?.tier}<small>RANK {rarity?.score}</small></b></div><ProvenanceSeal hash={result.hash} primary={house?.primary ?? "#c9a25e"} secondary={house?.secondary ?? "#ead69e"}/><CertificateShare title={artworkName(result.hash,result.features)} hash={result.hash}/><ScienceSignature features={result.features} words={result.words} /><div className="hash">SHA-256 / {result.hash}</div><Stats features={result.features} /><BaseMintButton seedHash={`0x${result.hash}`}/><div className="result-actions"><Link className="secondary-button" href="/mint">VIEW FULL CERTIFICATE</Link><button className="secondary-button" onClick={() => setResult(null)}>RECORD AGAIN</button></div></section></div><SiteFooter/></>}
  </main>;
}
