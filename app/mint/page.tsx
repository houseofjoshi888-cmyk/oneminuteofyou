"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { LivingRenderer } from "@/components/LivingRenderer";
import { Stats } from "@/components/Stats";
import { WalletButton } from "@/components/WalletButton";
import { ProvenanceSeal } from "@/components/ProvenanceSeal";
import type { InteractionFeatures } from "@/lib/analyzer";
import { artworkName, createMetadata, exportLivingLoop, exportMetadata, exportPng } from "@/lib/export";
import { royalHouseFromWords, royalRarity } from "@/lib/houses";
import { renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { COMPOSITIONS, DEFAULT_SIMULATION, isSurfaceComposition, SURFACE_SIMULATION, simulateParticles } from "@/lib/simulation";
import { exportProvenanceCertificate } from "@/lib/provenance";
import { royalChronicle } from "@/lib/chronicle";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }

export default function MintPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [exporting, setExporting] = useState(false);
  const [recordingLoop, setRecordingLoop] = useState(false);
  const [livingCanvas, setLivingCanvas] = useState<HTMLCanvasElement | null>(null);
  const [actionError, setActionError] = useState("");
  useEffect(() => { const stored = sessionStorage.getItem("one-minute-result"); if (!stored) return; const id = window.setTimeout(() => { try { const parsed = JSON.parse(stored) as Result; if (!parsed?.hash || !Array.isArray(parsed.words) || !parsed.features) throw new Error(); setResult(parsed); } catch { sessionStorage.removeItem("one-minute-result"); setActionError("The saved portrait was invalid. Please record a new minute."); } }, 0); return () => clearTimeout(id); }, []);
  const metadata = useMemo(() => result ? createMetadata(result.hash, result.features, DEFAULT_SIMULATION) : null, [result]);
  const highRes = useCallback(async () => { if (!result) return; setExporting(true); setActionError(""); try { await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); const canvas = document.createElement("canvas"); const composition = result.words[0] % COMPOSITIONS.length; const frame = simulateParticles(result.words, result.features, isSurfaceComposition(composition) ? SURFACE_SIMULATION : DEFAULT_SIMULATION); renderArtwork(canvas, frame, renderConfigForHouse(result.words)); exportPng(canvas, `one-minute-${result.hash.slice(0, 8)}-4096.png`); } catch { setActionError("This device could not complete the 4096px export. Close other tabs and try again."); } finally { setExporting(false); } }, [result]);
  const livingLoop = useCallback(async () => { if (!result || !livingCanvas) return; setRecordingLoop(true); setActionError(""); try { await exportLivingLoop(livingCanvas, `one-minute-${result.hash.slice(0, 8)}-living.webm`); } catch { setActionError("Living-loop export is not supported by this browser. The PNG and metadata exports still work."); } finally { setRecordingLoop(false); } }, [result, livingCanvas]);

  if (!result) return <main className="result-page"><nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><WalletButton /></nav><section className="result-copy" style={{ maxWidth: 620, margin: "12vh auto" }}><p className="eyebrow"><span /> NO PORTRAIT FOUND</p><h2>Your minute<br /><em>awaits.</em></h2><p className="mint-note">{actionError || "Record a minute first. Your portrait and metadata stay only in this browser session."}</p><Link className="primary-button" href="/generate">Begin recording <span>↗</span></Link></section></main>;

  const title = artworkName(result.hash, result.features);
  const house = royalHouseFromWords(result.words);
  const rarity = royalRarity(result.hash, result.features.coverage + result.features.directionEntropy + result.features.pressureMean);
  const chronicle = royalChronicle(result.hash, result.features, house, title);
  const houseStyle = { "--house-primary": house.primary, "--house-secondary": house.secondary } as CSSProperties;

  return <main className="result-page" style={houseStyle}>
    <nav className="studio-nav"><Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link><div className="wallet-nav"><span className="nav-note">{house.name.toUpperCase()} / {result.hash.slice(0, 8).toUpperCase()}</span><WalletButton /></div></nav>
    <div className="result-grid">
      <LivingRenderer words={result.words} features={result.features} onReady={setLivingCanvas} />
      <section className="result-copy">
        <p className="eyebrow"><span /> ONE MINUTE OF YOU · ROYAL HOUSES</p>
        <h2>{title}<br /><em>of {house.name}.</em></h2>
        <p className="mint-note">The live preview uses a fast deterministic subset to protect your device. Your exported 4096×4096 royal NFT always includes the full 100,000-particle simulation.</p>
        <div className="royal-house-card"><span className="house-gem">◆</span><div><small>ROYAL HOUSE</small><strong>{house.name}</strong><em>{house.motto}</em></div><b>{rarity.tier}<small>RANK {rarity.score}</small></b></div>
        <ProvenanceSeal hash={result.hash} primary={house.primary} secondary={house.secondary} />
        <article className="royal-chronicle"><small>THE ROYAL CHRONICLE · {chronicle.omen.toUpperCase()}</small><h3>{chronicle.title}</h3><p>{chronicle.legend}</p><blockquote>“{chronicle.decree}”</blockquote></article>
        <div className="nft-badge"><span>COLLECTION</span><strong>One Minute of You: Royal Houses</strong><i>1 / 1 · {result.hash.slice(0, 8).toUpperCase()}</i></div>
        <Stats features={result.features} />
        {actionError && <p className="action-error" role="alert">{actionError}</p>}
        <div className="result-actions"><button className="primary-button" onClick={highRes} disabled={exporting}>{exporting ? "Rendering royal NFT…" : "Export royal artwork"}<span>↓</span></button><button className="secondary-button living-export" onClick={livingLoop} disabled={recordingLoop || !livingCanvas}>{recordingLoop ? "Recording 12-second cycle…" : "Export living NFT loop"}</button><button className="secondary-button" onClick={() => metadata && exportMetadata(metadata, `${title.toLowerCase().replaceAll(" ", "-")}-${result.hash.slice(0, 8)}.json`)}>Royal metadata</button><button className="secondary-button" onClick={() => exportProvenanceCertificate(result.hash, title, house.name, house.primary, house.secondary)}>Provenance certificate</button></div>
        <pre className="metadata">{JSON.stringify(metadata, null, 2)}</pre>
      </section>
    </div>
  </main>;
}
