"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther, isAddress, isHex } from "viem";
import { useAccount, useBalance, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { ADMIN_WALLET, HOUSE_WALLET, SECONDARY_ROYALTY_BPS, isAdminWallet } from "@/lib/access";
import { oneMinuteContractAbi, oneMinuteContractAddress } from "@/lib/contract";

export function AdminAirdrop() {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();
  const [collector, setCollector] = useState("");
  const [seedHash, setSeedHash] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [message, setMessage] = useState("");
  const owner = useReadContract({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "owner", query: { enabled: Boolean(oneMinuteContractAddress && isAdminWallet(address)) } });
  const treasuryBalance = useBalance({ address: oneMinuteContractAddress, chainId: base.id, query: { enabled: Boolean(oneMinuteContractAddress && isAdminWallet(address)), refetchInterval: 12_000 } });
  const authorized = isAdminWallet(address);
  const isContractOwner = Boolean(authorized && owner.data && owner.data.toLowerCase() === ADMIN_WALLET.toLowerCase());

  const airdrop = async () => {
    if (!oneMinuteContractAddress || !isContractOwner || !isAddress(collector) || !isHex(seedHash, { strict: true }) || seedHash.length !== 66 || !/^ipfs:\/\/.+/.test(metadataURI)) { setMessage("Enter a valid collector, 32-byte seed, and IPFS metadata URI."); return; }
    setMessage("");
    try {
      await switchChainAsync({ chainId: base.id });
      const hash = await writeContractAsync({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "ownerMint", args: [collector as `0x${string}`, seedHash as `0x${string}`, metadataURI], chainId: base.id });
      setMessage(`Airdrop submitted: ${hash}`);
    } catch { setMessage("Airdrop was not completed. Confirm the Base network and transaction in the administrator wallet."); }
  };

  const withdraw = async () => {
    if (!oneMinuteContractAddress || !isContractOwner) return;
    setMessage("");
    try {
      await switchChainAsync({ chainId: base.id });
      const hash = await writeContractAsync({ address: oneMinuteContractAddress, abi: oneMinuteContractAbi, functionName: "withdraw", chainId: base.id });
      setMessage(`Treasury transfer submitted: ${hash}`);
    } catch { setMessage("Treasury transfer was not completed."); }
  };

  return <ConnectButton.Custom>{({ account, openConnectModal, mounted }) => {
    if (!mounted || !account) return <section className="admin-gate"><p className="eyebrow"><span /> RESTRICTED</p><h1>Administrator<br/><em>access.</em></h1><p>Connect the authorized contract wallet to open the deployment and airdrop console.</p><button className="primary-button" onClick={openConnectModal}>Connect administrator wallet <span>◆</span></button></section>;
    if (!authorized) return <section className="admin-gate"><p className="eyebrow"><span /> ACCESS DENIED</p><h1>Private<br/><em>console.</em></h1><p>The connected account is not authorized. No administrative data or actions are available.</p><button className="secondary-button" onClick={openConnectModal}>Change wallet</button></section>;
    if (!oneMinuteContractAddress) return <section className="admin-card"><p className="eyebrow"><span /> DEPLOYMENT READY</p><h2>Contract configuration.</h2><dl className="admin-ledger"><div><dt>Contract owner</dt><dd>{ADMIN_WALLET}</dd></div><div><dt>House treasury</dt><dd>{HOUSE_WALLET}</dd></div><div><dt>Secondary royalty</dt><dd>{SECONDARY_ROYALTY_BPS / 100}% · ERC-2981</dd></div></dl><p className="mint-note">Deploy the contract from this wallet, verify it on Base, then configure its address to unlock airdrops and treasury controls.</p></section>;
    if (owner.isLoading) return <p className="mint-note">Verifying administrator authority on Base…</p>;
    if (!isContractOwner) return <p className="action-error">The configured contract is not owned by the authorized administrator wallet. Controls remain locked.</p>;
    return <div className="admin-console"><section className="admin-card treasury-card"><p className="eyebrow"><span /> HOUSE TREASURY</p><h2>Primary proceeds.</h2><dl className="admin-ledger"><div><dt>Destination</dt><dd>{HOUSE_WALLET}</dd></div><div><dt>Contract balance</dt><dd>{treasuryBalance.data ? `${formatEther(treasuryBalance.data.value)} ETH` : "Reading Base…"}</dd></div><div><dt>Secondary royalty</dt><dd>7% · marketplace support required</dd></div></dl><button className="secondary-button" onClick={withdraw} disabled={isPending || !treasuryBalance.data?.value}>Send balance to House wallet</button></section><section className="admin-card"><p className="eyebrow"><span /> OWNER-ONLY AIRDROP</p><h2>Grant a royal edition.</h2><label>Collector wallet<input value={collector} onChange={event => setCollector(event.target.value.trim())} placeholder="0x…" /></label><label>Unique SHA-256 seed<input value={seedHash} onChange={event => setSeedHash(event.target.value.trim())} placeholder="0x…" /></label><label>Pinned metadata URI<input value={metadataURI} onChange={event => setMetadataURI(event.target.value.trim())} placeholder="ipfs://…/metadata.json" /></label><small>Each seed can be minted once. The contract owner check and 500-token supply cap are enforced on-chain.</small><button className="primary-button" onClick={airdrop} disabled={isPending}>{isPending ? "Awaiting confirmation…" : "Airdrop on Base"}<span>↗</span></button>{message && <p className="mint-note">{message}</p>}</section></div>;
  }}</ConnectButton.Custom>;
}
