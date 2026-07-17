import { mixWords, mulberry32 } from "./random";
import type { InteractionFeatures } from "./analyzer";

export interface SimulationConfig { particleCount: number; steps: number; fieldScale: number; stepLength: number; turbulence: number; }
export const DEFAULT_SIMULATION: SimulationConfig = { particleCount: 100_000, steps: 54, fieldScale: 3.2, stepLength: 0.0018, turbulence: 0.54 };
export interface ParticleFrame { starts: Float32Array; ends: Float32Array; tones: Uint8Array; }
export const COMPOSITIONS = ["Solar Vortex", "Twin Bloom", "Silk Current", "Orbital Halo", "Drifting Nebula"] as const;

export function simulateParticles(words: [number, number, number, number], features: InteractionFeatures, config: SimulationConfig = DEFAULT_SIMULATION): ParticleFrame {
  const random = mulberry32(mixWords(words));
  const count = Math.max(100_000, Math.floor(config.particleCount));
  const starts = new Float32Array(count * 2), ends = new Float32Array(count * 2), tones = new Uint8Array(count);
  const entropy = features.directionEntropy / Math.log2(12);
  const arms = 3 + (words[1] % 6);
  const composition = words[0] % COMPOSITIONS.length;
  const phase = (words[2] / 4294967296) * Math.PI * 2;
  const tilt = ((words[3] / 4294967296) - .5) * 1.2;
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), 0.67) * 0.46;
    let x: number, y: number;
    if (composition === 1) {
      const side = random() > .5 ? 1 : -1; const lobeRadius = Math.pow(random(), .72) * .24;
      x = .5 + side * (.19 + features.coverage * .06) + Math.cos(angle) * lobeRadius;
      y = .5 + Math.sin(angle) * lobeRadius * .78;
    } else if (composition === 2) {
      x = .04 + random() * .92;
      const band = Math.floor(random() * (3 + words[1] % 4));
      y = .18 + band * .64 / Math.max(2, 2 + words[1] % 4) + Math.sin(x * (7 + arms) + phase + band) * .055 + (random() - .5) * .045;
    } else if (composition === 3) {
      const ring = .17 + (words[1] % 5) * .025;
      const ringRadius = ring + (random() - .5) * .12;
      x = .5 + Math.cos(angle) * ringRadius;
      y = .5 + Math.sin(angle) * ringRadius * (.7 + features.coverage * .35);
    } else if (composition === 4) {
      const cluster = Math.floor(random() * 4); const clusterAngle = phase + cluster * Math.PI * .57;
      const cx = .5 + Math.cos(clusterAngle) * (.12 + cluster * .045); const cy = .5 + Math.sin(clusterAngle) * (.08 + cluster * .035);
      const cloudRadius = Math.pow(random(), 1.25) * (.1 + cluster * .028);
      x = cx + Math.cos(angle) * cloudRadius; y = cy + Math.sin(angle) * cloudRadius * .6;
    } else {
      x = 0.5 + Math.cos(angle) * radius * (0.78 + features.coverage * 0.35);
      y = 0.5 + Math.sin(angle) * radius;
    }
    starts[i * 2] = x; starts[i * 2 + 1] = y;
    for (let step = 0; step < config.steps; step++) {
      const cx = x - 0.5, cy = y - 0.5;
      const polar = Math.atan2(cy, cx), r = Math.hypot(cx, cy);
      let field: number;
      if (composition === 1) {
        const focusX = x < .5 ? .31 : .69; const localX = x - focusX; const localY = y - .5; const localPolar = Math.atan2(localY, localX);
        field = localPolar + Math.PI / 2 + Math.sin(localPolar * arms + Math.hypot(localX, localY) * 38 + phase) * .48 + (x < .5 ? .12 : -.12);
      } else if (composition === 2) {
        field = tilt + Math.sin(x * (12 + arms) + y * 16 + phase) * .22 + Math.cos(y * 31 - phase) * .09;
      } else if (composition === 3) {
        const ringTarget = .2 + (words[1] % 5) * .025; const correction = (ringTarget - r) * 3.4;
        field = polar + Math.PI / 2 + correction + Math.sin(polar * arms + phase) * .3;
      } else if (composition === 4) {
        field = Math.sin(x * 11 + phase) * 1.1 + Math.cos(y * 13 - phase) * .85 + tilt + Math.sin((x + y) * 19) * .22;
      } else {
        const wave = Math.sin((polar * arms) + r * config.fieldScale * 20 + phase);
        field = polar + Math.PI / 2 + wave * config.turbulence + Math.sin(y * 19 + x * 11) * 0.12 * entropy;
      }
      const length = config.stepLength * (0.72 + random() * 0.56) * (1 + features.averageSpeed * 0.025);
      x += Math.cos(field) * length; y += Math.sin(field) * length;
      if (x < 0 || x > 1 || y < 0 || y > 1) break;
    }
    ends[i * 2] = x; ends[i * 2 + 1] = y; tones[i] = Math.floor(random() * 255);
  }
  return { starts, ends, tones };
}
