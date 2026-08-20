"use client";

import { Brand } from "@/components/Brand";
import { AdminAirdrop } from "@/components/AdminAirdrop";
import { AdminMintControls } from "@/components/AdminMintControls";
import { SiteFooter } from "@/components/SiteFooter";

export default function AdminPage() { return <main className="result-page"><nav className="studio-nav"><Brand /><span className="nav-note">PRIVATE CONTRACT CONSOLE</span></nav><section className="admin-wrap"><AdminMintControls/><AdminAirdrop /></section><SiteFooter /></main>; }
