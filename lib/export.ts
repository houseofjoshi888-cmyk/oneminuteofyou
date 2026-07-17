import type { InteractionFeatures } from "./analyzer";
import type { SimulationConfig } from "./simulation";
import { COMPOSITIONS } from "./simulation";

export interface ArtworkMetadata {
  name: string;
  collection: { name: string; family: string };
  description: string;
  image: string;
  seed: string;
  edition: string;
  attributes: { trait_type: string; value: string | number }[];
  simulation: SimulationConfig;
}

const firstNames = ["Aurora", "Velvet", "Solar", "Prismatic", "Celestial", "Electric", "Opaline", "Radiant", "Astral", "Luminous", "Iridescent", "Infinite"];
const lastNames = ["Drift", "Reverie", "Pulse", "Orbit", "Bloom", "Echo", "Current", "Trace", "Whisper", "Arc", "Constellation", "Tide"];

export function artworkName(hash: string, features: InteractionFeatures): string {
  const first = firstNames[Number.parseInt(hash.slice(0, 4), 16) % firstNames.length];
  const lastIndex = (Number.parseInt(hash.slice(4, 8), 16) + features.taps + features.pauses) % lastNames.length;
  return `${first} ${lastNames[lastIndex]}`;
}

export function compositionName(hash: string): string {
  return COMPOSITIONS[Number.parseInt(hash.slice(0, 8), 16) % COMPOSITIONS.length];
}

export function createMetadata(hash: string, features: InteractionFeatures, simulation: SimulationConfig): ArtworkMetadata {
  const title = artworkName(hash, features); const edition = hash.slice(0, 8).toUpperCase();
  return { name: `${title} — One Minute of You`, collection: { name: "One Minute of You", family: "One Minute of You" }, description: `“${title}” is a deterministic generative NFT portrait derived from sixty seconds of human movement.`, image: "artwork.png", seed: hash, edition, simulation, attributes: [
    { trait_type: "Artwork", value: title }, { trait_type: "Composition", value: compositionName(hash) }, { trait_type: "Edition", value: edition }, { trait_type: "Distance", value: features.distance }, { trait_type: "Average speed", value: features.averageSpeed }, { trait_type: "Curvature", value: features.averageCurvature }, { trait_type: "Pauses", value: features.pauses }, { trait_type: "Taps", value: features.taps }, { trait_type: "Direction entropy", value: features.directionEntropy }, { trait_type: "Coverage", value: features.coverage },
  ] };
}

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportPng(canvas: HTMLCanvasElement, name: string) { canvas.toBlob(blob => { if (blob) download(blob, name); }, "image/png"); }
export function exportMetadata(metadata: ArtworkMetadata, name: string) { download(new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" }), name); }
