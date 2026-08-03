"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { LivingRenderer } from "@/components/LivingRenderer";
import { Stats } from "@/components/Stats";
import { WalletButton } from "@/components/WalletButton";
import { ProvenanceSeal } from "@/components/ProvenanceSeal";
import type { InteractionFeatures } from "@/lib/analyzer";
import { artworkName, createMetadata } from "@/lib/export";
import { royalHouseFromWords, royalRarity } from "@/lib/houses";
import { DEFAULT_SIMULATION } from "@/lib/simulation";
import { royalChronicle } from "@/lib/chronicle";
import { BaseMintButton } from "@/components/BaseMintButton";
import { Brand } from "@/components/Brand";
import { ScienceSignature } from "@/components/ScienceSignature";
import { hiddenDiscoveries } from "@/lib/discoveries";
import { SiteFooter } from "@/components/SiteFooter";

interface Result { features: InteractionFeatures; hash: string; words: [number, number, number, number]; }

export default function MintPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [actionError, setActionError] = useState("");
  useEffect(() => { const stored = sessionStorage.getItem("one-minute-result"); if (!stored) return; const id = window.setTimeout(() => { try { const parsed = JSON.parse(stored) as Result; if (!parsed?.hash || !Array.isArray(parsed.words) || !parsed.features) throw new Error(); setResult(parsed); } catch { sessionStorage.removeItem("one-minute-result"); setActionError("The saved portrait was invalid. Please record a new minute."); } }, 0); return () => clearTimeout(id); }, []);
  const metadata = useMemo(() => result ? createMetadata(result.hash, result.features, DEFAULT_SIMULATION) : null, [result]);

  if (!result) return <main className="result-page"><nav className="studio-nav"><Brand /><WalletButton /></nav><section className="result-copy" style={{ maxWidth: 620, margin: "12vh auto" }}><p className="eyebrow"><span /> NO PORTRAIT FOUND</p><h2>Your minute<br /><em>awaits.</em></h2><p className="mint-note">{actionError || "Record a minute first. Your portrait and metadata stay only in this browser session."}</p><Link className="primary-button" href="/generate">Begin recording <span>↗</span></Link></section><SiteFooter /></main>;

  const title = artworkName(result.hash, result.features);
  const house = royalHouseFromWords(result.words);
  const rarity = royalRarity(result.hash, result.features.coverage + result.features.directionEntropy + result.features.pressureMean);
  const chronicle = royalChronicle(result.hash, result.features, house, title);
  const discoveries = hiddenDiscoveries(result.features, result.words);
  const houseStyle = { "--house-primary": house.primary, "--house-secondary": house.secondary } as CSSProperties;

  return <main className="result-page" style={houseStyle}>
    <nav className="studio-nav"><Brand /><div className="wallet-nav"><span className="nav-note">{house.name.toUpperCase()} / {result.hash.slice(0, 8).toUpperCase()}</span><WalletButton /></div></nav>
    <div className="result-grid">
      <LivingRenderer words={result.words} features={result.features} />
      <section className="result-copy">
        <p className="eyebrow"><span /> ONE MINUTE OF YOU · ROYAL HOUSES</p>
        <h2>{title}<br /><em>of {house.name}.</em></h2>
        <p className="mint-note">Your portrait is deterministically resolved from the movement seed, House algorithm, and full generative simulation.</p>
        <div className="royal-house-card"><span className="house-gem">◆</span><div><small>ROYAL HOUSE · {house.algorithm.toUpperCase()}</small><strong>{house.name}</strong><em>{house.motto}</em></div><b>{rarity.tier}<small>RANK {rarity.score}</small></b></div>
        <section className="discoveries"><small>HIDDEN DISCOVERIES</small>{discoveries.map(discovery => <div key={discovery.title}><strong>{discovery.title}</strong><p>{discovery.detail}</p></div>)}</section>
        <ProvenanceSeal hash={result.hash} primary={house.primary} secondary={house.secondary} />
        <article className="royal-chronicle"><small>THE ROYAL CHRONICLE · {chronicle.omen.toUpperCase()}</small><h3>{chronicle.title}</h3><p>{chronicle.legend}</p><blockquote>“{chronicle.decree}”</blockquote></article>
        <div className="nft-badge"><span>COLLECTION</span><strong>One Minute of You: Royal Houses</strong><i>1 / 1 · {result.hash.slice(0, 8).toUpperCase()}</i></div>
        <ScienceSignature features={result.features} words={result.words} />
        <Stats features={result.features} />
        {actionError && <p className="action-error" role="alert">{actionError}</p>}
        <BaseMintButton seedHash={`0x${result.hash}`} />
        <pre className="metadata">{JSON.stringify(metadata, null, 2)}</pre>
      </section>
    </div><SiteFooter />
  </main>;
}
