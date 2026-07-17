import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/" aria-label="One Minute of You home"><span className="brand-crest"><Image src="/house-of-joshi-crest.png" alt="House of Joshi crest" width={42} height={42} priority /></span><span>ONE MINUTE <i>OF</i> YOU</span></Link>;
}
