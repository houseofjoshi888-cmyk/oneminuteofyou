import type { InteractionFeatures } from "./analyzer";
import { scientificSignature } from "./science";

const prime = (value: number) => value > 1 && Array.from({ length: Math.floor(Math.sqrt(value)) - 1 }, (_, index) => index + 2).every((divisor) => value % divisor !== 0);

/** Behavioural discoveries are reproducible from the recorded minute; no mint lottery is involved. */
export function hiddenDiscoveries(features: InteractionFeatures, words: readonly number[]) {
  const science = scientificSignature(features, words); const findings: { title: string; detail: string }[] = [];
  if (features.averageSpeed < .012 && features.pauses >= 2) findings.push({ title: "Still Flame", detail: "A rare low-velocity field with deliberate silence." });
  if (features.averageCurvature > 14 && features.coverage < .42) findings.push({ title: "Perfect Orbit", detail: "Curvature held a tightly bounded orbit." });
  if (prime(features.taps)) findings.push({ title: "Prime Pulse", detail: `${features.taps} touches resolved to a prime cadence.` });
  if (Math.abs(science.harmonicOrder / science.symmetry - 1.618) < .12) findings.push({ title: "Golden Ratio", detail: "The harmonic and symmetry orders approached φ." });
  if (science.entropy > .91 && features.coverage > .7) findings.push({ title: "Wild Constellation", detail: "Exceptionally broad, high-entropy movement." });
  return findings.length ? findings : [{ title: "First Disturbance", detail: "A singular interaction field has been observed." }];
}
