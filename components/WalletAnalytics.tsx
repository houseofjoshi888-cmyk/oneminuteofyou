"use client";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { track } from "@/lib/telemetry";
export function WalletAnalytics(){const {isConnected,chainId}=useAccount();const reported=useRef(false);useEffect(()=>{if(isConnected&&!reported.current){reported.current=true;track("wallet_connected",{chainId:chainId||0})}if(!isConnected)reported.current=false},[isConnected,chainId]);return null}
