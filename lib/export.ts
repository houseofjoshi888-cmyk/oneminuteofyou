import type { InteractionFeatures } from "./analyzer";
import type { SimulationConfig } from "./simulation";

export interface ArtworkMetadata { name: string; description: string; image: string; seed: string; createdAt: string; attributes: { trait_type: string; value: string | number }[]; simulation: SimulationConfig; }

export function createMetadata(hash: string, features: InteractionFeatures, simulation: SimulationConfig): ArtworkMetadata {
  return { name: `One Minute of You — ${hash.slice(0, 8).toUpperCase()}`, description: "A deterministic generative portrait derived from sixty seconds of pointer movement.", image: "artwork.png", seed: hash, createdAt: new Date().toISOString(), simulation, attributes: [
    { trait_type: "Distance", value: features.distance }, { trait_type: "Average speed", value: features.averageSpeed }, { trait_type: "Curvature", value: features.averageCurvature }, { trait_type: "Pauses", value: features.pauses }, { trait_type: "Taps", value: features.taps }, { trait_type: "Direction entropy", value: features.directionEntropy }, { trait_type: "Coverage", value: features.coverage },
  ] };
}

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportPng(canvas: HTMLCanvasElement, name: string) { canvas.toBlob(blob => { if (blob) download(blob, name); }, "image/png"); }
export function exportMetadata(metadata: ArtworkMetadata, name: string) { download(new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" }), name); }
