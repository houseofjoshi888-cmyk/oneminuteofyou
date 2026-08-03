"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { isAddress, isHex } from "viem";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

export function AdminAirdrop() {
  const { address } = useAccount(); const { switchChainAsync } = useSwitchChain(); const { writeContractAsync, isPending } = useWriteContract();
  const [collector, setCollector] = useState(""); const [seedHash, setSeedHash] = useState(""); const [metadataURI, setMetadataURI] = useState(""); const [message, setMessage] = useState("");
  const owner = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "owner", query: { enabled: Boolean(oneMinuteContractAddress) } });
  const isOwner = Boolean(address && owner.data && address.toLowerCase() === owner.data.toLowerCase());
  const submit = async () => { if (!oneMinuteContractAddress || !isOwner || !isAddress(collector) || !isHex(seedHash, { strict: true }) || seedHash.length !== 66 || !/^ipfs:\/\/.+/.test(metadataURI)) return; setMessage(""); try { await switchChainAsync({ chainId: base.id }); const hash = await writeContractAsync({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "ownerMint", args: [collector as `0x${string}`, seedHash as `0x${string}`, metadataURI], chainId: base.id }); setMessage(`Airdrop submitted: ${hash}`); } catch { setMessage("Airdrop was not completed. Confirm your owner wallet, Base network, seed, and IPFS URI."); } };
  if (!oneMinuteContractAddress) return <p className="mint-note">Admin tools appear after the verified Base contract address is configured.</p>;
  return <ConnectButton.Custom>{({ account, openConnectModal, mounted }) => {
    if (!mounted || !account) return <button className="primary-button" onClick={openConnectModal}>Connect owner wallet <span>◆</span></button>;
    if (owner.isLoading) return <p className="mint-note">Checking contract ownership…</p>;
    if (!isOwner) return <p className="action-error">This connected wallet is not the contract owner. Admin controls remain locked.</p>;
    return <section className="admin-card"><p className="eyebrow"><span /> OWNER-ONLY AIRDROP</p><h2>Grant a royal edition.</h2><label>Collector wallet<input value={collector} onChange={event => setCollector(event.target.value.trim())} placeholder="0x…" /></label><label>Unique SHA-256 seed<input value={seedHash} onChange={event => setSeedHash(event.target.value.trim())} placeholder="0x…" /></label><label>Pinned metadata URI<input value={metadataURI} onChange={event => setMetadataURI(event.target.value.trim())} placeholder="ipfs://…/metadata.json" /></label><small>Each seed can be minted once. The contract’s onlyOwner check and supply cap are enforced on-chain.</small><button className="primary-button" onClick={submit} disabled={isPending}>{isPending ? "Awaiting confirmation…" : "Airdrop on Base"}<span>↗</span></button>{message && <p className="mint-note">{message}</p>}</section>;
  }}</ConnectButton.Custom>;
}
