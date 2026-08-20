import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";

export default function AboutPage() { return <EditorialPage eyebrow="THE ORIGINAL ALGORITHM" title={<>Movement becomes<br/><em>memory.</em></>} intro="One Minute of You is a deterministic generative-art experience by The House of Joshi. It turns one minute of human movement into a permanent, one-of-one visual record.">
  <section><small>01 · THE IDEA</small><h2>Your presence is the input.</h2><p>No two people move through a minute in exactly the same way. Direction, speed, acceleration, curvature, pauses, taps, and canvas coverage become the raw material for the artwork.</p></section>
  <section><small>02 · THE FIVE HOUSES</small><h2>Five visual languages.</h2><p>Every verified seed enters Peridot, Ruby, Sapphire, Turquoise, or Gold. The House defines a palette and mathematical grammar; the recorded movement determines the final composition.</p></section>
  <section><small>03 · THE COLLECTION</small><h2>Five hundred human minutes.</h2><p>The collection is capped at 5,200 NFTs. Each token stores a permanent still image, a living artwork, motion-derived metadata, a renderer version, and a SHA-256 provenance seed.</p></section>
  <Link className="primary-button" href="/generate">Begin your minute <span>↗</span></Link>
 </EditorialPage>; }
