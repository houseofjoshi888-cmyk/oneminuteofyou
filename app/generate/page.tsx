"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Recorder } from "@/components/Recorder";
import { Renderer } from "@/components/Renderer";
import { Stats } from "@/components/Stats";
import { analyzeRecording, type InteractionFeatures } from "@/lib/analyzer";
import { seedFromFeatures } from "@/lib/seed";
import type { Recording } from "@/lib/recorder";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }

export default function GeneratePage() {
  const [result, setResult] = useState<Result | null>(null);
  const complete = useCallback(async (recording: Recording) => {
    const features = analyzeRecording(recording); const seed = await seedFromFeatures(features); const value = { features, ...seed };
    sessionStorage.setItem("one-minute-result", JSON.stringify(value)); setResult(value);
  }, []);
  return <main className={result ? "result-page" : "studio"}>
    <nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><span className="nav-note">{result ? "YOUR DETERMINISTIC PORTRAIT" : "60 SECONDS · PRIVATE · LOCAL"}</span></nav>
    {!result ? <Recorder onComplete={complete} /> : <div className="result-grid"><Renderer words={result.words} features={result.features} /><section className="result-copy"><p className="eyebrow"><span /> PORTRAIT COMPLETE</p><h2>A trace of<br /><em>your attention.</em></h2><p className="mint-note">The same fingerprint will always resolve to this exact composition. No randomness remains outside your seed.</p><div className="hash">SHA-256 / {result.hash}</div><Stats features={result.features} /><div className="result-actions"><Link className="primary-button" href="/mint">Prepare edition <span>↗</span></Link><button className="secondary-button" onClick={() => setResult(null)}>Record again</button></div></section></div>}
  </main>;
}
