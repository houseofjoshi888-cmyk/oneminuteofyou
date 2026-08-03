"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { LivingRenderer } from "@/components/LivingRenderer";
import { CertificateShare } from "@/components/CertificateShare";
import type { InteractionFeatures } from "@/lib/analyzer";
import { artworkName } from "@/lib/export";
import { royalHouseFromWords } from "@/lib/houses";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

interface Result { features: InteractionFeatures; hash: string; words: [number,number,number,number]; }

export function MuseumMode({ tokenId }: { tokenId: number }) {
  const [record,setRecord]=useState<Result|null>(null);
  const [catalogue,setCatalogue]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{try{const stored=sessionStorage.getItem("one-minute-result"); if(stored)setRecord(JSON.parse(stored) as Result);}catch{sessionStorage.removeItem("one-minute-result");}},0);return()=>window.clearTimeout(timer);},[]);
  const owner=useReadContract({address:oneMinuteContractAddress,abi:oneMinuteContractAbi,functionName:"ownerOf",args:[BigInt(tokenId)],query:{enabled:Boolean(oneMinuteContractAddress)}});
  if(!record)return <main className="museum-page museum-empty"><header className="museum-nav"><Link href="/">ONE MINUTE OF YOU</Link><Link href="/generate">CREATE</Link></header><section><small>NO ARTWORK LOADED</small><h1>Your museum is empty.</h1><p>Create an artwork in this browser or open a verified on-chain token.</p><Link className="primary-button" href="/generate">BEGIN YOUR MINUTE <span>↗</span></Link></section></main>;
  const house=royalHouseFromWords(record.words),title=artworkName(record.hash,record.features);
  return <main className="museum-page protected-certificate" data-certificate={record.hash.slice(0,8).toUpperCase()} onContextMenu={event=>event.preventDefault()} style={{"--house-primary":house.primary,"--house-secondary":house.secondary} as React.CSSProperties}>
    <header className="museum-nav"><Link href="/">ONE MINUTE OF YOU</Link><div><button onClick={()=>setCatalogue(value=>!value)}>{catalogue?"CLOSE DETAILS":"ARTWORK DETAILS"}</button><CertificateShare title={title} hash={record.hash}/></div></header>
    <div className="museum-art"><LivingRenderer words={record.words} features={record.features}/></div>
    {catalogue&&<aside className="museum-catalogue"><small>DETERMINISTIC PROVENANCE</small><h1>{title}</h1><dl><dt>House</dt><dd>{house.name}</dd><dt>Algorithm</dt><dd>{house.algorithm}</dd><dt>Seed</dt><dd>{record.hash}</dd><dt>Owner</dt><dd>{owner.data?String(owner.data):"Not minted on-chain"}</dd></dl>{oneMinuteContractAddress&&<a href={`https://basescan.org/token/${oneMinuteContractAddress}?a=${tokenId}`} target="_blank" rel="noreferrer">VIEW ON BASESCAN ↗</a>}</aside>}
  </main>;
}
