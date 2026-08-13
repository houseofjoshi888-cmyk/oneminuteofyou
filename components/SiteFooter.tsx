import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} ONE MINUTE OF YOU</span><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/collection">Story</Link><Link href="/gallery">Live gallery</Link><Link href="/my-collection">My collection</Link><Link href="/generate">Create</Link><Link href="/legal">Terms & privacy</Link></nav><span>DETERMINISTIC · ROYAL HOUSES</span></footer>;
}
