"use client";

import type { ArtworkMetadata } from "@/lib/export";
import BaseMintButtonInner from "./BaseMintButtonInner";
interface MintProps { seedHash: string; metadata?: ArtworkMetadata; canvas?: HTMLCanvasElement | null; }
export function BaseMintButton(props: MintProps) {
  return <BaseMintButtonInner {...props} />;
}
