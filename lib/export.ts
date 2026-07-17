import type { InteractionFeatures } from "./analyzer";
import type { SimulationConfig } from "./simulation";
import { COMPOSITIONS } from "./simulation";
import { royalHouseFromHash, royalRarity } from "./houses";

export interface ArtworkMetadata {
  name: string;
  collection: { name: string; family: string };
  description: string;
  image: string;
  seed: string;
  edition: string;
  provenance: { algorithm: "SHA-256"; seal: string; verification: string };
  attributes: { trait_type: string; value: string | number }[];
  simulation: SimulationConfig;
}

export function artworkName(hash: string, features: InteractionFeatures): string {
  const house = royalHouseFromHash(hash);
  const first = house.titles[Number.parseInt(hash.slice(0, 4), 16) % house.titles.length];
  const lastIndex = (Number.parseInt(hash.slice(4, 8), 16) + features.taps + features.pauses) % house.subjects.length;
  return `${first} ${house.subjects[lastIndex]}`;
}

export function compositionName(hash: string): string {
  return COMPOSITIONS[Number.parseInt(hash.slice(0, 8), 16) % COMPOSITIONS.length];
}

export function createMetadata(hash: string, features: InteractionFeatures, simulation: SimulationConfig): ArtworkMetadata {
  const title = artworkName(hash, features); const edition = hash.slice(0, 8).toUpperCase(); const house = royalHouseFromHash(hash); const rarity = royalRarity(hash, features.coverage + features.directionEntropy + features.pressureMean);
  return { name: `${title} — One Minute of You`, collection: { name: "One Minute of You: Royal Houses", family: "One Minute of You" }, description: `“${title}” is a ${rarity.tier.toLowerCase()} portrait of ${house.name}, deterministically derived from sixty seconds of human movement.`, image: "artwork.png", seed: hash, edition, provenance: { algorithm: "SHA-256", seal: hash.slice(0, 16).toUpperCase(), verification: "Recompute SHA-256 from the canonical interaction feature serialization." }, simulation, attributes: [
    { trait_type: "Artwork", value: title }, { trait_type: "Royal House", value: house.name }, { trait_type: "Gemstone", value: house.gemstone }, { trait_type: "Royal Rarity", value: rarity.tier }, { trait_type: "Rarity Score", value: rarity.score }, { trait_type: "Ornament", value: house.ornament }, { trait_type: "Composition", value: compositionName(hash) }, { trait_type: "Edition", value: edition }, { trait_type: "Distance", value: features.distance }, { trait_type: "Average speed", value: features.averageSpeed }, { trait_type: "Curvature", value: features.averageCurvature }, { trait_type: "Pauses", value: features.pauses }, { trait_type: "Taps", value: features.taps }, { trait_type: "Direction entropy", value: features.directionEntropy }, { trait_type: "Coverage", value: features.coverage },
  ] };
}

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportPng(canvas: HTMLCanvasElement, name: string) { canvas.toBlob(blob => { if (blob) download(blob, name); }, "image/png"); }
export function exportMetadata(metadata: ArtworkMetadata, name: string) { download(new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" }), name); }
