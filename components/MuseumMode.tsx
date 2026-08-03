"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { LivingRenderer } from "@/components/LivingRenderer";
import { artworkName } from "@/lib/export";
import { hiddenDiscoveries } from "@/lib/discoveries";
import { museumRecord } from "@/lib/museum";
import { royalHouseFromWords } from "@/lib/houses";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

export function MuseumMode({ tokenId }: { tokenId: number }) {
  const [catalogue, setCatalogue] = useState(false); const record = museumRecord(tokenId); const house = royalHouseFromWords(record.words); const title = artworkName(record.hash, record.features); const discoveries = hiddenDiscoveries(record.features, record.words);
  const owner = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "ownerOf", args: [BigInt(tokenId)], query: { enabled: Boolean(oneMinuteContractAddress) } });
  const share = async () => { try { await navigator.share?.({ title, url: window.location.href }); } catch { await navigator.clipboard?.writeText(window.location.href); } };
  return <main className="museum-page" style={{ "--house-primary": house.primary, "--house-secondary": house.secondary } as React.CSSProperties}>
    <header className="museum-nav"><span>ONE MINUTE OF YOU · {String(tokenId).padStart(3, "0")}</span><div><button onClick={() => setCatalogue(value => !value)}>{catalogue ? "Close catalogue" : "Museum catalogue"}</button><button onClick={share}>Share</button></div></header>
    <div className="museum-art"><LivingRenderer words={record.words} features={record.features} /></div>
    {catalogue && <aside className="museum-catalogue"><small>PERMANENT PROVENANCE / TOKEN {tokenId}</small><h1>{title}</h1><dl><dt>House</dt><dd>{house.name}</dd><dt>Algorithm</dt><dd>{house.algorithm}</dd><dt>Seed</dt><dd>{record.hash}</dd><dt>Owner</dt><dd>{owner.data || "Awaiting on-chain mint"}</dd><dt>Mint transaction</dt><dd>Available once minted on Base</dd><dt>Transfer history</dt><dd>View on BaseScan after the first transfer</dd></dl><section><small>HIDDEN DISCOVERIES</small>{discoveries.map(item => <p key={item.title}><strong>{item.title}</strong> — {item.detail}</p>)}</section><a href={`https://basescan.org/token/${oneMinuteContractAddress ?? ""}?a=${tokenId}`} target="_blank" rel="noreferrer">View on BaseScan ↗</a></aside>}
  </main>;
}
