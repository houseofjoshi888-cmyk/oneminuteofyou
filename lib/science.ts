import type { InteractionFeatures } from "./analyzer";

export type GeometryRegime = "Logarithmic Spiral" | "Lissajous Weave" | "Radial Harmonics" | "Topographic Flow" | "Gesture Attractor";

export interface ScientificSignature {
  model: "Kinematic Geometry v1";
  regime: GeometryRegime;
  harmonicOrder: number;
  symmetry: number;
  entropy: number;
  kineticIndex: number;
  curvatureFlux: number;
  turbulence: number;
  fieldScale: number;
  stepLength: number;
  equation: string;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const q = (value: number, digits = 4) => Number(value.toFixed(digits));

/**
 * Maps a canonical interaction recording to finite, documented kinematic values.
 * It contains no clock, device, or unseeded random input, so it is reproducible
 * anywhere the same feature serialization and SHA-256 seed are available.
 */
export function scientificSignature(features: InteractionFeatures, words: readonly number[]): ScientificSignature {
  const entropy = clamp(features.directionEntropy / Math.log2(12));
  const speed = 1 - Math.exp(-Math.max(0, features.averageSpeed) * 2.6);
  const acceleration = 1 - Math.exp(-Math.max(0, features.averageAcceleration) * 0.34);
  const curvature = 1 - Math.exp(-Math.max(0, features.averageCurvature) * 0.62);
  const coverage = clamp(features.coverage);
  const kineticIndex = q(speed * .56 + acceleration * .27 + coverage * .17);
  const curvatureFlux = q(curvature * .68 + entropy * .32);
  const regimeIndex = (words[2] + Math.round(entropy * 1_000) + Math.round(curvature * 1_000)) % 5;
  const regimes: GeometryRegime[] = ["Logarithmic Spiral", "Lissajous Weave", "Radial Harmonics", "Topographic Flow", "Gesture Attractor"];
  const harmonicOrder = 3 + ((words[1] + Math.round(entropy * 17) + features.taps) % 10);
  const symmetry = 2 + ((words[3] + Math.round(curvatureFlux * 31)) % 7);
  const fieldScale = q(2.25 + entropy * 2.25 + curvature * .9);
  const turbulence = q(.18 + entropy * .43 + acceleration * .22);
  const stepLength = q(.00115 + kineticIndex * .00115 + coverage * .00025, 6);
  return {
    model: "Kinematic Geometry v1",
    regime: regimes[regimeIndex],
    harmonicOrder,
    symmetry,
    entropy: q(entropy),
    kineticIndex,
    curvatureFlux,
    turbulence,
    fieldScale,
    stepLength,
    equation: `θ = atan2(y,x) + sin(${harmonicOrder}θ + ${q(fieldScale, 2)}r) · ${turbulence}`,
  };
}
