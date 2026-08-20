import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";

const questions = [
  ["Does the app use a camera?", "No. It records pointer, touch, or stylus movement inside the drawing field. Camera and microphone access are not required."],
  ["Why is every NFT different?", "The complete movement signature and SHA-256 seed influence topology, focal point, symmetry, density, negative space, glow, palette balance, and particle behaviour."],
  ["What are the five Houses?", "Peridot, Ruby, Sapphire, Turquoise, and Gold are five visual grammars. A House defines the palette and field behaviour, while your motion determines the one-of-one composition."],
  ["How many NFTs exist?", "The planned collection supply is 5,200 NFTs."],
  ["What does minting cost?", "The public contract price is 0.025 ETH on Base, plus the network gas shown by your wallet."],
  ["What is minted?", "The token metadata references a high-resolution still image and a living HTML artwork, together with the seed, movement-derived traits, House, and renderer version."],
  ["Where can I see my NFT?", "After minting and indexing, it appears in My Collection, the on-chain gallery, compatible wallets, and marketplaces such as OpenSea."],
  ["Can a transaction be reversed?", "No. Confirmed blockchain transactions are normally irreversible. Always verify the wallet, network, price, and contract first."],
  ["What if minting is interrupted?", "Open the Mint Recovery page on the same device to inspect prepared assets and transaction state."],
  ["Is my raw movement uploaded?", "No. Raw pointer and touch samples stay in your browser. Public metadata contains the derived seed, House, traits, renderer version, and permanent media."],
];
export default function FAQPage() { return <EditorialPage eyebrow="FREQUENTLY ASKED QUESTIONS" title={<>Before your<br/><em>minute begins.</em></>} intro="A concise guide to recording, generation, Royal Houses, minting, ownership, and recovery.">
  <div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
  <div className="editorial-actions"><Link className="primary-button" href="/generate">Begin your minute <span>↗</span></Link><a className="secondary-button" href="https://thehouseofjoshi.com/contact" target="_blank" rel="noreferrer">Contact support</a></div>
 </EditorialPage>; }
