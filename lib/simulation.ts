import { mixWords, mulberry32 } from "./random";
import type { InteractionFeatures } from "./analyzer";

export interface SimulationConfig { particleCount: number; steps: number; fieldScale: number; stepLength: number; turbulence: number; }
export const DEFAULT_SIMULATION: SimulationConfig = { particleCount: 100_000, steps: 54, fieldScale: 3.2, stepLength: 0.0018, turbulence: 0.54 };
export interface ParticleFrame { starts: Float32Array; ends: Float32Array; tones: Uint8Array; }

export function simulateParticles(words: [number, number, number, number], features: InteractionFeatures, config: SimulationConfig = DEFAULT_SIMULATION): ParticleFrame {
  const random = mulberry32(mixWords(words));
  const count = Math.max(100_000, Math.floor(config.particleCount));
  const starts = new Float32Array(count * 2), ends = new Float32Array(count * 2), tones = new Uint8Array(count);
  const entropy = features.directionEntropy / Math.log2(12);
  const arms = 3 + (words[1] % 6);
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), 0.67) * 0.46;
    let x = 0.5 + Math.cos(angle) * radius * (0.78 + features.coverage * 0.35);
    let y = 0.5 + Math.sin(angle) * radius;
    starts[i * 2] = x; starts[i * 2 + 1] = y;
    for (let step = 0; step < config.steps; step++) {
      const cx = x - 0.5, cy = y - 0.5;
      const polar = Math.atan2(cy, cx), r = Math.hypot(cx, cy);
      const wave = Math.sin((polar * arms) + r * config.fieldScale * 20 + (words[2] / 4294967296) * Math.PI * 2);
      const field = polar + Math.PI / 2 + wave * config.turbulence + Math.sin(y * 19 + x * 11) * 0.12 * entropy;
      const length = config.stepLength * (0.72 + random() * 0.56) * (1 + features.averageSpeed * 0.025);
      x += Math.cos(field) * length; y += Math.sin(field) * length;
      if (x < 0 || x > 1 || y < 0 || y > 1) break;
    }
    ends[i * 2] = x; ends[i * 2 + 1] = y; tones[i] = Math.floor(random() * 255);
  }
  return { starts, ends, tones };
}
