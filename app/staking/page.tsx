import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";

export default function StakingPage() {
  return <EditorialPage eyebrow="THE ROYAL VAULT" title={<>Staking is<br/><em>coming soon.</em></>} intro="The staking programme is not live yet. A future space will let collectors place eligible One Minute of You works into a transparent on-chain programme.">
    <section><small>01 · CURRENT STATUS</small><div><h2>No deposits are active.</h2><p>There is no staking contract and this page will never ask you to approve or transfer an NFT while the programme is marked Coming Soon.</p></div></section>
    <section><small>02 · DESIGN PRINCIPLES</small><div><h2>Non-custodial by design.</h2><p>Any future mechanism will publish its contract address, eligibility rules, reward source, lock conditions, risks, and independent review before activation.</p></div></section>
    <section><small>03 · SAFETY</small><div><h2>Verify before signing.</h2><p>Announcements will appear on this domain and link to verified Base contracts. Ignore unsolicited staking links, direct messages, and approvals.</p></div></section>
    <Link className="primary-button" href="/">Return home <span>↗</span></Link>
  </EditorialPage>;
}
