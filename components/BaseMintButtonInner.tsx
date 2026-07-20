"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { isHex } from "viem";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

export default function BaseMintButtonInner({ seedHash }: { seedHash: string }) {
  const [metadataURI, setMetadataURI] = useState(""); const [status, setStatus] = useState(""); const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(); const { switchChainAsync } = useSwitchChain(); const { writeContractAsync, isPending } = useWriteContract(); const receipt = useWaitForTransactionReceipt({ hash: transactionHash });
  const enabled = Boolean(oneMinuteContractAddress && /^ipfs:\/\/.+/.test(metadataURI) && isHex(seedHash, { strict: true }) && seedHash.length === 66);
  const price = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "mintPrice", query: { enabled: Boolean(oneMinuteContractAddress) } });
  const isOpen = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "publicMintOpen", query: { enabled: Boolean(oneMinuteContractAddress) } });
  const mint = async () => { if (!enabled || !oneMinuteContractAddress || typeof price.data !== "bigint") return; setStatus("Checking Base network…"); try { await switchChainAsync({ chainId: base.id }); setStatus("Confirm in your wallet…"); const hash = await writeContractAsync({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "mintOneMinute", args: [seedHash as `0x${string}`, metadataURI], value: price.data, chainId: base.id }); setTransactionHash(hash); setStatus("Transaction pending on Base…"); } catch { setStatus("Mint was not completed. Check the Base network, contract status, and wallet confirmation."); } };
  if (!oneMinuteContractAddress) return <p className="mint-note">Base mint is ready in the app, but the verified contract address has not been configured yet.</p>;
  return <ConnectButton.Custom>{({ account, openConnectModal, mounted }) => {
    if (!mounted || !account) return <button className="primary-button" onClick={openConnectModal}>Connect to mint on Base <span>◆</span></button>;
    const minted = receipt.isSuccess && transactionHash;
    return <div className="base-mint"><p className="mint-steps">01 WALLET CONNECTED <b>→</b> 02 BASE CHECK <b>→</b> 03 CONFIRM <b>→</b> 04 PENDING <b>→</b> 05 MINTED</p><label htmlFor="metadata-uri">Pinned metadata URI <input id="metadata-uri" value={metadataURI} onChange={event => setMetadataURI(event.target.value.trim())} placeholder="ipfs://bafy.../metadata.json" /></label><small>One Minute of You mints are immutable. Upload and pin the PNG, loop, and JSON before confirming.</small>{isOpen.data === false && <p className="action-error">Public mint is not open yet.</p>}<button className="primary-button" onClick={mint} disabled={!enabled || isPending || receipt.isLoading || isOpen.data === false}>{isPending ? "Confirm in wallet…" : receipt.isLoading ? "Mint pending on Base…" : `Mint on Base${typeof price.data === "bigint" ? " · " + Number(price.data) / 1e18 + " ETH" : ""}`}<span>↗</span></button>{status && <p className="mint-note">{status}</p>}{minted && <p className="mint-note">Minted. <a href={`https://basescan.org/tx/${transactionHash}`} target="_blank" rel="noreferrer">View on BaseScan ↗</a> · <a href="https://opensea.io" target="_blank" rel="noreferrer">View on OpenSea ↗</a></p>}</div>;
  }}</ConnectButton.Custom>;
}
