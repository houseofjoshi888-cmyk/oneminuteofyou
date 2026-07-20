"use client";

import { Brand } from "@/components/Brand";
import WalletProviders from "@/components/WalletProviders";
import { AdminAirdrop } from "@/components/AdminAirdrop";

export default function AdminPage() { return <WalletProviders><main className="result-page"><nav className="studio-nav"><Brand /><span className="nav-note">PRIVATE CONTRACT CONSOLE</span></nav><section className="admin-wrap"><AdminAirdrop /></section></main></WalletProviders>; }
