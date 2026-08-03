import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} ONE MINUTE OF YOU</span><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/collection">Collection</Link><Link href="/generate">Create</Link><Link href="/artwork/1">Museum</Link><Link href="/legal">Terms & privacy</Link></nav><span>BASE · ROYAL HOUSES</span></footer>;
}
