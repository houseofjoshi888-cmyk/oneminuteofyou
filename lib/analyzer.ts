import type { Recording } from "./recorder";

export interface InteractionFeatures {
  version: 1;
  durationMs: number;
  samples: number;
  distance: number;
  averageSpeed: number;
  peakSpeed: number;
  averageAcceleration: number;
  averageCurvature: number;
  pauses: number;
  pauseDurationMs: number;
  taps: number;
  directionEntropy: number;
  coverage: number;
  pressureMean: number;
  pointerMix: Record<string, number>;
}

const q = (value: number, digits = 6) => Number(value.toFixed(digits));

export function analyzeRecording(recording: Recording): InteractionFeatures {
  const p = recording.points;
  let distance = 0, speedSum = 0, peakSpeed = 0, acceleration = 0, curvature = 0, speedCount = 0, accelerationCount = 0, turnCount = 0, pauses = 0, pauseDurationMs = 0, taps = 0, pressure = 0;
  const directions = new Array(12).fill(0) as number[];
  const cells = new Set<string>();
  const pointerMix: Record<string, number> = {};
  let previousSpeed = 0, previousAngle: number | null = null, pauseOpen = false;

  for (let i = 0; i < p.length; i++) {
    const point = p[i];
    cells.add(`${Math.min(9, Math.floor(point.x * 10))}:${Math.min(9, Math.floor(point.y * 10))}`);
    pressure += point.pressure;
    pointerMix[point.pointer] = (pointerMix[point.pointer] || 0) + 1;
    if (point.kind === "down") taps++;
    if (i === 0) continue;
    const previous = p[i - 1];
    const dx = point.x - previous.x, dy = point.y - previous.y;
    const segment = Math.hypot(dx, dy);
    const dt = Math.max(1, point.t - previous.t);
    const speed = segment / (dt / 1000);
    distance += segment;
    speedSum += speed;
    peakSpeed = Math.max(peakSpeed, speed);
    speedCount++;
    if (i > 1) { acceleration += Math.abs(speed - previousSpeed) / (dt / 1000); accelerationCount++; }
    previousSpeed = speed;
    if (segment > 0.0005) {
      const angle = Math.atan2(dy, dx);
      const bucket = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * directions.length) % directions.length;
      directions[bucket]++;
      if (previousAngle !== null) {
        let turn = Math.abs(angle - previousAngle);
        if (turn > Math.PI) turn = Math.PI * 2 - turn;
        curvature += turn / Math.max(segment, 0.0001);
        turnCount++;
      }
      previousAngle = angle;
    }
    if (speed < 0.008) { if (!pauseOpen && dt >= 80) { pauses++; pauseOpen = true; } pauseDurationMs += dt; } else pauseOpen = false;
  }

  const directionTotal = directions.reduce((a, b) => a + b, 0);
  const entropy = directionTotal ? -directions.reduce((sum, count) => count ? sum + (count / directionTotal) * Math.log2(count / directionTotal) : sum, 0) : 0;
  return {
    version: 1, durationMs: recording.durationMs, samples: p.length,
    distance: q(distance), averageSpeed: q(speedSum / Math.max(1, speedCount)), peakSpeed: q(peakSpeed),
    averageAcceleration: q(acceleration / Math.max(1, accelerationCount)), averageCurvature: q(curvature / Math.max(1, turnCount)),
    pauses, pauseDurationMs: Math.round(pauseDurationMs), taps, directionEntropy: q(entropy), coverage: q(cells.size / 100),
    pressureMean: q(pressure / Math.max(1, p.length)), pointerMix,
  };
}

export function stableSerialize(features: InteractionFeatures): string {
  const sort = (value: unknown): unknown => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sort(v)])) : value;
  return JSON.stringify(sort(features));
}
