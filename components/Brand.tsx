import Link from "next/link";

export function Brand() {
  // Vercel serves this static export without Vinext's Cloudflare image endpoint.
  // eslint-disable-next-line @next/next/no-img-element
  return <Link className="brand" href="/" aria-label="One Minute of You home"><span className="brand-crest"><img src="/one-minute-of-you-logo.png" alt="One Minute of You hourglass seal" width={42} height={42} /></span><span>ONE MINUTE <i>OF</i> YOU</span></Link>;
}
