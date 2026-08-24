import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";

const facts = [
  ["Price", "0.025 ETH on Base, plus wallet-displayed gas"],
  ["Maximum supply", "5,200 NFTs"],
  ["Wallet limit", "Maximum 5 lifetime primary mints when public mint opens"],
  ["House assignment", "Derived from the SHA-256 movement seed; it cannot be selected manually"],
  ["House distribution", "The seed maps across five equal index slots: Peridot, Ruby, Sapphire, Turquoise, and Gold"],
  ["Creator royalty", "7% ERC-2981 preference; collection depends on marketplace support"],
];

export default function BeforeYouMintPage(){return <EditorialPage eyebrow="BUYER TRUST · READ BEFORE MINTING" title={<>Know exactly<br/><em>what you collect.</em></>} intro="One Minute of You is a personal generative artwork, not a promise of financial return. Review the current product, launch gates, ownership terms, and risks before signing a transaction.">
  <section><small>01 · WHAT YOU RECEIVE</small><div><h2>Five layers of identity.</h2><p>Your NFT connects one movement-derived seed to its mathematical traits, finished artwork, Royal House, and blockchain provenance. The final artwork is visible before minting, with a certificate and public verification record.</p></div></section>
  <div className="trust-facts">{facts.map(([label,value])=><div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
  <section><small>02 · LIVE IN THE APP</small><div><h2>Available now.</h2><p>Sixty-second touch, pointer, or stylus recording; local feature analysis; deterministic seed generation; House reveal; final still preview; movement traits; certificate sharing; wallet connection; verification; mint recovery; and wallet-based collection views.</p></div></section>
  <section><small>03 · GUARANTEED NFT RECORD</small><div><h2>Designed for independent provenance.</h2><p>Each successful mint records its seed, House, traits digest, metadata URI, and frozen renderer version. The token metadata permanently references its media; this website is an additional interface, not the source of ownership.</p></div></section>
  <section><small>04 · NOT LIVE AT LAUNCH</small><div><h2>Future features are not purchase promises.</h2><p>Staking, QUEENJOSHI rewards, governance, Royal Council activity, future drops, House exchange, and a Unity artwork remain planned. Staking will not activate until its contract is audited, funded, and its complete reward and withdrawal rules are published.</p></div></section>
  <section><small>05 · RARITY</small><div><h2>House and movement rarity are separate.</h2><p>House assignment uses one of five equal seed index slots. Movement rarity uses the published motion score: Noble 0–69, Sovereign 70–87, Imperial 88–96, and Crown Jewel 97–99. The rules are fixed in the released renderer; no manual rarity roll occurs at mint.</p></div></section>
  <section><small>06 · PRIVACY</small><div><h2>Raw movement stays local.</h2><p>Pointer, touch, and stylus samples are processed in your browser and are not uploaded. Public metadata may contain the derived traits, seed, House, renderer version, and media references—but never the raw movement path.</p></div></section>
  <section><small>07 · LAUNCH GATES</small><div><h2>No verified contract, no public mint.</h2><p>Public mint must remain closed until the Base contract address, verified source, treasury and royalty receiver, renderer digest, permanent CIDs, test rehearsal, and independent review are published. Staking has its own later audit and funding gate.</p></div></section>
  <section><small>08 · RISKS & SECONDARY SALES</small><div><h2>Collect the artwork, not a guaranteed return.</h2><p>NFT prices can fall to zero. Marketplaces may not enforce royalties or index media immediately. Blockchain transactions are generally irreversible, and secondary transfers are governed by marketplace and network rules. A Royal Five badge is an optional collector achievement, never a requirement.</p></div></section>
  <div className="editorial-actions"><Link className="primary-button" href="/generate">Preview the experience <span>↗</span></Link><Link className="secondary-button" href="/faq">Read buyer FAQ</Link></div>
 </EditorialPage>}
