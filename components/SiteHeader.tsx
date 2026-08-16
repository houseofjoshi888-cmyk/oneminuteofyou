import Link from "next/link";
import { Brand } from "./Brand";
import { WalletButton } from "./WalletButton";

export function SiteHeader() {
  return <header className="global-site-header">
    <Brand />
    <nav aria-label="Primary navigation">
      <Link href="/about">About</Link>
      <Link href="/how-it-works">How it works</Link>
      <Link href="/houses">Houses</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/my-collection">My collection</Link>
      <Link href="/staking">Staking</Link>
    </nav>
    <div className="global-header-actions"><Link href="/generate">Create</Link><WalletButton /></div>
  </header>;
}
