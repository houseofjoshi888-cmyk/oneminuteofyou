import { EditorialPage } from "@/components/EditorialPage";

export default function SecurityPage() { return <EditorialPage eyebrow="SECURITY & PROVENANCE" title={<>Verify first.<br/><em>Then mint.</em></>} intro="Security is shared between the app, smart contract, storage network, connected wallet, and collector. Use the checks below before every transaction.">
  <section><h2>Wallet safety</h2><p>The app never asks for a seed phrase or private key. Read every wallet prompt, verify the network and contract, and reject unexpected signatures or approvals.</p></section>
  <section><h2>Contract protections</h2><p>The collection contract enforces a fixed 5,200-token supply, 0.025 ETH price, duplicate-seed prevention, mint dates, wallet limits, pausing, owner-only airdrops, and owner-only withdrawal to the fixed House treasury. Mainnet release remains gated on independent review and Base Sepolia rehearsal.</p></section>
  <section><h2>Deterministic verification</h2><p>Each NFT records a SHA-256 seed and renderer version. The public verifier recomputes the seed from the canonical motion-feature record so a mismatch is visible rather than silently replaced.</p></section>
  <section><h2>Storage and recovery</h2><p>Still, living artwork, and metadata are prepared before mint confirmation. Local recovery records help resume interrupted transactions without regenerating the artwork.</p></section>
  <section><h2>Responsible disclosure</h2><p>If you identify a security issue, do not exploit it or expose collector information. Send a clear report through <a href="https://thehouseofjoshi.com/contact" target="_blank" rel="noreferrer">The House of Joshi contact page ↗</a>.</p></section>
 </EditorialPage>; }
