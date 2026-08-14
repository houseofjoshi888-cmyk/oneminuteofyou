"use client";
/* eslint-disable @next/next/no-img-element -- NFT media is remote IPFS content. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ipfsGateway, MAX_SUPPLY, oneMinuteContractAbi, oneMinuteContractAddress, openSeaItemUrl } from "@/lib/contract";
import { metadataTrait, type NftMetadata, shortAddress } from "@/lib/onchain";
import { LiveMintCounter } from "./LiveMintCounter";

interface Item { tokenId:number; owner?:string; uri?:string; metadata?:NftMetadata; }
interface Props { ownerOnly?:boolean; houseFilter?:string; recentOnly?:boolean; mosaic?:boolean; }
export function OnchainCollection({ownerOnly=false,houseFilter,recentOnly=false,mosaic=false}:Props){
  const {address}=useAccount(); const [items,setItems]=useState<Item[]>([]);
  const total=useReadContract({address:oneMinuteContractAddress,abi:oneMinuteContractAbi,functionName:"totalMinted",query:{enabled:Boolean(oneMinuteContractAddress),refetchInterval:12_000}});
  const count=typeof total.data==="bigint"?Math.min(MAX_SUPPLY,Number(total.data)):0;
  const ids=useMemo(()=>Array.from({length:count},(_,i)=>i+1),[count]);
  const reads=useReadContracts({contracts:ids.flatMap(tokenId=>[{address:oneMinuteContractAddress!,abi:oneMinuteContractAbi,functionName:"ownerOf" as const,args:[BigInt(tokenId)]},{address:oneMinuteContractAddress!,abi:oneMinuteContractAbi,functionName:"tokenURI" as const,args:[BigInt(tokenId)]}]),query:{enabled:Boolean(oneMinuteContractAddress&&count),refetchInterval:15_000}});
  useEffect(()=>{if(!reads.data)return;const base=ids.map((tokenId,index)=>({tokenId,owner:reads.data?.[index*2]?.result as string|undefined,uri:reads.data?.[index*2+1]?.result as string|undefined}));Promise.all(base.map(async item=>{try{const response=await fetch(ipfsGateway(item.uri)||"");return {...item,metadata:response.ok?await response.json() as NftMetadata:undefined};}catch{return item;}})).then(setItems);},[reads.data,ids]);
  const owned=ownerOnly?items.filter(item=>address&&item.owner?.toLowerCase()===address.toLowerCase()):items;
  const housed=houseFilter?owned.filter(item=>String(metadataTrait(item.metadata,"Royal House")||"").toLowerCase().includes(houseFilter.toLowerCase())):owned;
  const visible=recentOnly?[...housed].reverse().slice(0,12):housed;
  const houses=new Set(visible.map(item=>String(metadataTrait(item.metadata,"Royal House")||""))).size;
  const achievements=[visible.length>0&&"FIRST MINUTE",visible.length>=5&&"FIVEFOLD COLLECTOR",houses>=2&&"CROSS-HOUSE PATRON",houses===5&&"ROYAL CARTOGRAPHER"].filter(Boolean) as string[];
  if(!oneMinuteContractAddress)return <section className="chain-empty"><LiveMintCounter/><h2>The on-chain collection opens after contract deployment.</h2><p>No demo NFTs are shown. The verified Base contract will supply every owner, token URI and image.</p></section>;
  if(ownerOnly&&!address)return <section className="chain-empty"><h2>Connect the collecting wallet.</h2><p>Ownership is checked against the ERC-721 contract on Base.</p><ConnectButton/></section>;
  return <section className={`onchain-wrap${mosaic?" mosaic-wrap":""}`}><LiveMintCounter/>{ownerOnly&&<div className="collector-summary"><small>COLLECTOR · {shortAddress(address)}</small><strong>{visible.length} OWNED</strong><span>{achievements.length?achievements.join(" · "):"Your first achievement unlocks after minting."}</span></div>}{!mosaic&&<div className="collection-map" aria-label="Collection map">{visible.map((item,index)=><Link key={item.tokenId} href={`/artwork/${item.tokenId}`} style={{left:`${7+(index*37)%87}%`,top:`${14+(index*53)%72}%`} as React.CSSProperties}>{item.tokenId}</Link>)}</div>}{count===0?<div className="chain-empty compact"><h2>The first mint is waiting.</h2><p>The collection is connected; no tokens have been minted yet.</p></div>:<div className={mosaic?"mosaic-grid":"onchain-grid"}>{visible.map(item=><article key={item.tokenId}>{item.metadata?.image?<img src={ipfsGateway(item.metadata.image)} alt={item.metadata.name||`One Minute #${item.tokenId}`}/>:<div className="nft-loading">METADATA SYNC</div>}{!mosaic&&<><small>#{item.tokenId} · {metadataTrait(item.metadata,"Royal House")||"HOUSE INDEXING"}</small><h3>{item.metadata?.name||`One Minute #${item.tokenId}`}</h3><p>{shortAddress(item.owner)}</p><div><Link href={`/artwork/${item.tokenId}`}>DETAILS ↗</Link>{openSeaItemUrl(item.tokenId)&&<a href={openSeaItemUrl(item.tokenId)} target="_blank" rel="noreferrer">OPENSEA ↗</a>}</div></>}</article>)}</div>}{mosaic&&<p className="mosaic-status">{count===MAX_SUPPLY?"THE COMPLETE 500-PIECE CONSTELLATION":"THE MASTER MOSAIC GROWS WITH EVERY VERIFIED MINT"}</p>}</section>;
}
