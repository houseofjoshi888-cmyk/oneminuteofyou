import type { InteractionFeatures } from "./analyzer";

export interface NftMetadata {
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  seed?: string;
  renderer_version?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }>;
  movement?: InteractionFeatures;
}

export function metadataTrait(metadata: NftMetadata | null | undefined, name: string) {
  return metadata?.attributes?.find(item => item.trait_type === name)?.value;
}

export function shortAddress(value?: string) {
  return value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "—";
}
