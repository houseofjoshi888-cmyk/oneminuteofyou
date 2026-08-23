import Link from "next/link";

export function SiteFooter({ global = false }: { global?: boolean }) {
  if (!global) return null;
  return <footer className="site-footer global-site-footer">
    <div className="footer-brand"><strong>ONE MINUTE OF YOU</strong><p>Sixty seconds of movement become one deterministic artwork.</p></div>
    <div><h2>Explore</h2><nav aria-label="Explore"><Link href="/about">About</Link><Link href="/how-it-works">How it works</Link><Link href="/houses">Royal Houses</Link><Link href="/gallery">Collection</Link><Link href="/my-collection">My Collection</Link><Link href="/staking">Staking · Soon</Link><Link href="/generate">Create</Link></nav></div>
    <div><h2>Trust</h2><nav aria-label="Trust and support"><Link href="/terms">Terms & Conditions</Link><Link href="/privacy">Privacy Policy</Link><Link href="/nft-licence">NFT Licence</Link><Link href="/refunds">Refund Policy</Link><Link href="/security">Security</Link><Link href="/faq">FAQ</Link><Link href="/verify">Verify artwork</Link><Link href="/recovery">Mint recovery</Link><a href="https://thehouseofjoshi.com/contact" target="_blank" rel="noreferrer">Contact ↗</a></nav></div>
    <div><h2>Other projects</h2><nav aria-label="Other House of Joshi projects"><a href="https://swap.thehouseofjoshi.com/" target="_blank" rel="noreferrer">House of Joshi Swap ↗</a><a href="https://www.nftlaunchpad.thehouseofjoshi.com/" target="_blank" rel="noreferrer">NFT Launchpad ↗</a><a href="https://dreamweaver.thehouseofjoshi.com/" target="_blank" rel="noreferrer">Dreamweaver ↗</a><a href="https://nftmarketplace.thehouseofjoshi.com/" target="_blank" rel="noreferrer">NFT Marketplace ↗</a><a href="https://kingdomwithin.thehouseofjoshi.com/" target="_blank" rel="noreferrer">Kingdom Within ↗</a></nav></div>
    <p className="footer-copyright">© 2026 The House of Joshi. One Minute of You. All rights reserved.</p>
  </footer>;
}
