import { EditorialPage } from "@/components/EditorialPage";
export default function RefundsPage(){return <EditorialPage eyebrow="REFUND POLICY · EFFECTIVE 20 AUGUST 2026" title={<>Confirm carefully.<br/><em>Transactions persist.</em></>} intro="Blockchain transactions are irreversible once confirmed, so the app presents the final artwork, price, network, and metadata before mint submission.">
  <section><h2>Confirmed mints</h2><p>Confirmed NFT mints generally cannot be cancelled, reversed, or refunded because the token and funds settle through the Base network. Market-price changes, gas fees, wallet mistakes, or a change of mind do not create a refund right.</p></section>
  <section><h2>Failed transactions</h2><p>A failed transaction does not mint an NFT and the contract does not receive the mint price, though the network may still charge gas. Use Mint Recovery to inspect pending or interrupted attempts before retrying.</p></section>
  <section><h2>Service error</h2><p>If the contract receives payment but no token is issued because of a verified project-side defect, contact The House of Joshi with the transaction hash. Any remedy remains subject to applicable law and verifiable on-chain evidence.</p></section>
  <section><h2>Consumer rights</h2><p>Nothing in this policy excludes rights that cannot legally be excluded in your jurisdiction.</p></section>
 </EditorialPage>}
