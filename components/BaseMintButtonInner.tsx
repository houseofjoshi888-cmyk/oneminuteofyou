"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { isHex } from "viem";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

export default function BaseMintButtonInner({ seedHash }: { seedHash: string }) {
  const [metadataURI, setMetadataURI] = useState(""); const [status, setStatus] = useState(""); const { switchChainAsync } = useSwitchChain(); const { writeContractAsync, isPending } = useWriteContract();
  const enabled = Boolean(oneMinuteContractAddress && /^ipfs:\/\/.+/.test(metadataURI) && isHex(seedHash, { strict: true }) && seedHash.length === 66);
  const price = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "mintPrice", query: { enabled: Boolean(oneMinuteContractAddress) } });
  const isOpen = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "publicMintOpen", query: { enabled: Boolean(oneMinuteContractAddress) } });
  const mint = async () => { if (!enabled || !oneMinuteContractAddress || typeof price.data !== "bigint") return; setStatus(""); try { await switchChainAsync({ chainId: base.id }); const hash = await writeContractAsync({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "mintOneMinute", args: [seedHash as `0x${string}`, metadataURI], value: price.data, chainId: base.id }); setStatus(`Mint submitted: ${hash.slice(0, 10)}…`); } catch { setStatus("Mint was not completed. Check the Base network, contract status, and wallet confirmation."); } };
  if (!oneMinuteContractAddress) return <p className="mint-note">Base mint is ready in the app, but the verified contract address has not been configured yet.</p>;
  return <ConnectButton.Custom>{({ account, openConnectModal, mounted }) => {
    if (!mounted || !account) return <button className="primary-button" onClick={openConnectModal}>Connect to mint on Base <span>◆</span></button>;
    return <div className="base-mint"><label htmlFor="metadata-uri">Pinned metadata URI <input id="metadata-uri" value={metadataURI} onChange={event => setMetadataURI(event.target.value.trim())} placeholder="ipfs://bafy.../metadata.json" /></label><small>One Minute of You mints are immutable. Upload and pin the PNG, loop, and JSON before confirming.</small>{isOpen.data === false && <p className="action-error">Public mint is not open yet.</p>}<button className="primary-button" onClick={mint} disabled={!enabled || isPending || isOpen.data === false}>{isPending ? "Confirming mint…" : `Mint on Base${typeof price.data === "bigint" ? " · " + Number(price.data) / 1e18 + " ETH" : ""}`}<span>↗</span></button>{status && <p className="mint-note">{status}</p>}</div>;
  }}</ConnectButton.Custom>;
}
