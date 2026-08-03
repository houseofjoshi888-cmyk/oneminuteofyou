import type { InteractionFeatures } from "@/lib/analyzer";
import { scientificSignature } from "@/lib/science";

export function ScienceSignature({ features, words }: { features: InteractionFeatures; words: readonly number[] }) {
  const science = scientificSignature(features, words);
  const values = [
    ["Geometry", science.regime],
    ["Harmonic order", `${science.harmonicOrder}-fold`],
    ["Symmetry", `${science.symmetry}-axis`],
    ["Kinetic index", science.kineticIndex.toFixed(4)],
    ["Entropy", science.entropy.toFixed(4)],
    ["Curvature flux", science.curvatureFlux.toFixed(4)],
  ];
  return <article className="science-signature">
    <small>SCIENCE &amp; MATHEMATICS · {science.model.toUpperCase()}</small>
    <h3>Motion becomes a geometric law.</h3>
    <p>Velocity, acceleration, curvature, coverage, and directional entropy are normalized into a bounded flow field. The canonical features and SHA-256 seed reproduce these values exactly.</p>
    <div className="science-grid">{values.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <code>{science.equation}</code>
  </article>;
}
