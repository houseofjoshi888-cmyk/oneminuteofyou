import type { InteractionFeatures } from "./analyzer";
import type { SimulationConfig } from "./simulation";
import { COMPOSITIONS } from "./simulation";
import { royalHouseFromHash, royalRarity } from "./houses";
import { royalChronicle, type RoyalChronicle } from "./chronicle";
import { scientificSignature, type ScientificSignature } from "./science";

export interface ArtworkMetadata {
  name: string;
  collection: { name: string; family: string };
  description: string;
  image: string;
  seed: string;
  edition: string;
  provenance: { algorithm: "SHA-256"; seal: string; verification: string };
  animation_url: string;
  royal_chronicle: RoyalChronicle;
  attributes: { trait_type: string; value: string | number }[];
  simulation: SimulationConfig;
  scientific_signature: ScientificSignature;
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
  const science = scientificSignature(features, [0, 8, 16, 24].map(offset => Number.parseInt(hash.slice(offset, offset + 8), 16) >>> 0));
  return { name: `${title} — One Minute of You`, collection: { name: "One Minute of You: Royal Houses", family: "One Minute of You" }, description: `“${title}” is a ${rarity.tier.toLowerCase()} portrait of ${house.name}, deterministically derived from sixty seconds of human movement through a kinematic geometry model.`, image: "artwork.png", animation_url: "living-artwork.webm", seed: hash, edition, royal_chronicle: royalChronicle(hash, features, house, title), provenance: { algorithm: "SHA-256", seal: hash.slice(0, 16).toUpperCase(), verification: "Recompute SHA-256 from the canonical interaction feature serialization." }, simulation, scientific_signature: science, attributes: [
    { trait_type: "Artwork", value: title }, { trait_type: "Royal House", value: house.name }, { trait_type: "Gemstone", value: house.gemstone }, { trait_type: "Royal Rarity", value: rarity.tier }, { trait_type: "Rarity Score", value: rarity.score }, { trait_type: "Ornament", value: house.ornament }, { trait_type: "Composition", value: compositionName(hash) }, { trait_type: "Geometry Regime", value: science.regime }, { trait_type: "Harmonic Order", value: science.harmonicOrder }, { trait_type: "Symmetry", value: science.symmetry }, { trait_type: "Kinetic Index", value: science.kineticIndex }, { trait_type: "Curvature Flux", value: science.curvatureFlux }, { trait_type: "Edition", value: edition }, { trait_type: "Distance", value: features.distance }, { trait_type: "Average speed", value: features.averageSpeed }, { trait_type: "Curvature", value: features.averageCurvature }, { trait_type: "Pauses", value: features.pauses }, { trait_type: "Taps", value: features.taps }, { trait_type: "Direction entropy", value: features.directionEntropy }, { trait_type: "Coverage", value: features.coverage },
  ] };
}

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.style.display = "none"; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportPng(canvas: HTMLCanvasElement, name: string) { canvas.toBlob(blob => { if (blob) download(blob, name); }, "image/png"); }
export function exportMetadata(metadata: ArtworkMetadata, name: string) { download(new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" }), name); }
export function exportLivingLoop(canvas: HTMLCanvasElement, name: string, duration = 12_000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!("captureStream" in canvas) || typeof MediaRecorder === "undefined") { reject(new Error("Living loop export is not supported in this browser.")); return; }
    try {
      const stream = canvas.captureStream(30); const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" });
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { stream.getTracks().forEach(track => track.stop()); reject(new Error("Unable to record the living loop.")); };
      recorder.onstop = () => { download(new Blob(chunks, { type: "video/webm" }), name); stream.getTracks().forEach(track => track.stop()); resolve(); };
      recorder.start(); window.setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, duration);
    } catch { reject(new Error("Living loop export is not supported in this browser.")); }
  });
}
