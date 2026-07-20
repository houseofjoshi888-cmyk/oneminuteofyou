import type { InteractionFeatures } from "./analyzer";

export function museumRecord(tokenId: number) {
  const n = Math.max(1, Math.min(500, Math.floor(tokenId) || 1));
  const words: [number, number, number, number] = [Math.imul(n, 2654435761) >>> 0, Math.imul(n + 11, 2246822519) >>> 0, Math.imul(n + 29, 3266489917) >>> 0, Math.imul(n + 47, 668265263) >>> 0];
  const features: InteractionFeatures = { version: 2, durationMs: 60_000, samples: 280 + n % 600, distance: Number((.35 + (n % 67) / 100).toFixed(5)), averageSpeed: Number((.006 + (n % 31) / 1000).toFixed(6)), peakSpeed: .09 + (n % 8) / 100, averageAcceleration: .14 + (n % 19) / 20, averageCurvature: 2 + (n % 23), pauses: n % 9, pauseDurationMs: (n % 9) * 260, taps: 2 + n % 17, directionEntropy: 1.3 + (n % 21) / 10, coverage: .18 + (n % 73) / 100, pressureMean: .3 + (n % 6) / 10, pointerMix: { museum: 1 }, gestureTrace: Array.from({ length: 64 }, (_, i) => [(.5 + Math.cos(i / 10 + n) * .2), (.5 + Math.sin(i / 13 + n) * .2)]).flat(), tapTrace: [] };
  const hash = words.map((word) => word.toString(16).padStart(8, "0")).join("");
  return { tokenId: n, words, features, hash };
}
