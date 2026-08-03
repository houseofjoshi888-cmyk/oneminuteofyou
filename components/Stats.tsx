import type { InteractionFeatures } from "@/lib/analyzer";
export function Stats({ features }: { features: InteractionFeatures }) {
  const values = [
    ["Distance", `${features.distance.toFixed(2)} fields`], ["Mean velocity", features.averageSpeed.toFixed(3)], ["Acceleration", features.averageAcceleration.toFixed(3)], ["Curvature", features.averageCurvature.toFixed(2)], ["Pauses", features.pauses], ["Taps", features.taps], ["Direction entropy", features.directionEntropy.toFixed(3)], ["Canvas coverage", `${Math.round(features.coverage * 100)}%`],
  ];
  return <div className="stats-grid">{values.map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
