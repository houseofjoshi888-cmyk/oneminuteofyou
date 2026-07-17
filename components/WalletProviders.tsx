"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, mainnet, polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { useState, type ReactNode } from "react";

const chains = [mainnet, base, polygon] as const;
const transports = { [mainnet.id]: http(), [base.id]: http(), [polygon.id]: http() };
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const config = walletConnectProjectId
  ? getDefaultConfig({ appName: "One Minute of You", projectId: walletConnectProjectId, chains, transports, ssr: true })
  : createConfig({ chains, connectors: [injected()], transports, ssr: true });

export default function WalletProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <WagmiProvider config={config}><QueryClientProvider client={queryClient}><RainbowKitProvider theme={darkTheme({ accentColor: "#d5ad52", accentColorForeground: "#080604", borderRadius: "small", fontStack: "system" })}>{children}</RainbowKitProvider></QueryClientProvider></WagmiProvider>;
}
