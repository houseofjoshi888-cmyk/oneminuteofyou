"use client";
import { useReadContract } from "wagmi";
import { MAX_SUPPLY, oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";
export function LiveMintCounter() {
  const total=useReadContract({address:oneMinuteContractAddress,abi:oneMinuteContractAbi,functionName:"totalMinted",query:{enabled:Boolean(oneMinuteContractAddress),refetchInterval:12_000}});
  if(!oneMinuteContractAddress)return <div className="mint-counter is-offline"><small>LIVE MINT</small><strong>AWAITING CONTRACT</strong><span>0 public mints shown</span></div>;
  const minted=typeof total.data==="bigint"?Number(total.data):null;
  return <div className="mint-counter"><small>LIVE MINT COUNTER</small><strong>{minted===null?"SYNCING…":`${minted} / ${MAX_SUPPLY}`}</strong><span>{minted===null?"Reading Base":"Verified on Base"}</span></div>;
}
