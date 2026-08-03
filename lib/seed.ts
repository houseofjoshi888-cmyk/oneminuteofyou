import { stableSerialize, type InteractionFeatures } from "./analyzer";

export async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function seedFromFeatures(features: InteractionFeatures): Promise<{ hash: string; words: [number, number, number, number] }> {
  const hash = await sha256(stableSerialize(features));
  return { hash, words: [0, 8, 16, 24].map(offset => Number.parseInt(hash.slice(offset, offset + 8), 16) >>> 0) as [number, number, number, number] };
}
