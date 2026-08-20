"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { useState, type ReactNode } from "react";
import { WalletAnalytics } from "./WalletAnalytics";

const chains = [base] as const;
const transports = { [base.id]: http() };
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e6c24a866fea178aaaf6b3b316a060aa";
const config = walletConnectProjectId
  ? getDefaultConfig({ appName: "One Minute of You", projectId: walletConnectProjectId, chains, transports, ssr: true })
  : createConfig({ chains, connectors: [injected({ shimDisconnect: true })], transports, ssr: true, multiInjectedProviderDiscovery: false });

export default function WalletProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <WagmiProvider config={config}><QueryClientProvider client={queryClient}><RainbowKitProvider initialChain={base} modalSize="compact" theme={darkTheme({ accentColor: "#d5ad52", accentColorForeground: "#080604", borderRadius: "medium", fontStack: "system" })}><WalletAnalytics/>{children}</RainbowKitProvider></QueryClientProvider></WagmiProvider>;
}
