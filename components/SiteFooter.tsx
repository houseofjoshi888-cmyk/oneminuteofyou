import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} ONE MINUTE OF YOU</span><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/houses">Houses</Link><Link href="/mint-wall">Mint wall</Link><Link href="/mosaic">Mosaic</Link><Link href="/my-collection">My collection</Link><Link href="/recovery">Recovery</Link><Link href="/verify">Verify</Link><Link href="/generate">Create</Link></nav><span>DETERMINISTIC · ROYAL HOUSES</span></footer>;
}
