"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButtonInner() {
  return <ConnectButton.Custom>{({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
    const connected = mounted && account && chain;
    if (!mounted) return <button className="wallet-button" aria-hidden="true">Connect wallet</button>;
    if (!connected) return <button className="wallet-button" onClick={openConnectModal}>Connect wallet <span>◆</span></button>;
    if (chain.unsupported) return <button className="wallet-button wallet-warning" onClick={openChainModal}>Wrong network <span>!</span></button>;
    return <div className="wallet-connected"><button onClick={openChainModal} aria-label="Change network">{chain.name}</button><button onClick={openAccountModal} aria-label="Wallet account">{account.displayName}</button></div>;
  }}</ConnectButton.Custom>;
}
