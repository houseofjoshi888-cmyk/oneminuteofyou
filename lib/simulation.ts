import { mixWords, mulberry32 } from "./random";
import type { InteractionFeatures } from "./analyzer";

export interface SimulationConfig { particleCount: number; steps: number; fieldScale: number; stepLength: number; turbulence: number; }
export const DEFAULT_SIMULATION: SimulationConfig = { particleCount: 100_000, steps: 54, fieldScale: 3.2, stepLength: 0.0018, turbulence: 0.54 };
export const PREVIEW_SIMULATION: SimulationConfig = { ...DEFAULT_SIMULATION, particleCount: 18_000, steps: 32 };
export interface ParticleFrame { starts: Float32Array; ends: Float32Array; tones: Uint8Array; trace: Float32Array; taps: Float32Array; composition: number; }
export const COMPOSITIONS = ["Solar Vortex", "Twin Bloom", "Silk Current", "Orbital Halo", "Drifting Nebula", "Touch Echo", "Rose Lattice", "Constellation Weave", "Celestial Muse", "Sacred Lattice", "Chrysanthemum Bloom", "Art Deco Fan", "Marble River"] as const;

export function simulateParticles(words: [number, number, number, number], features: InteractionFeatures, config: SimulationConfig = DEFAULT_SIMULATION): ParticleFrame {
  const random = mulberry32(mixWords(words));
  const count = Math.max(1, Math.floor(config.particleCount));
  const starts = new Float32Array(count * 2), ends = new Float32Array(count * 2), tones = new Uint8Array(count);
  const entropy = features.directionEntropy / Math.log2(12);
  const arms = 3 + (words[1] % 6);
  const composition = words[0] % COMPOSITIONS.length;
  const phase = (words[2] / 4294967296) * Math.PI * 2;
  const tilt = ((words[3] / 4294967296) - .5) * 1.2;
  const trace = new Float32Array(features.gestureTrace?.length >= 4 ? features.gestureTrace : [.5, .5, .5, .5]);
  const taps = new Float32Array(features.tapTrace || []);
  const traceCount = trace.length / 2; const tapCount = taps.length / 2;
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), 0.67) * 0.46;
    let x: number, y: number;
    if (composition === 9) {
      const spacing = .075 + (words[1] % 4) * .008; const column = Math.floor(random() * 12) - 2; const row = Math.floor(random() * 12) - 2;
      x = .5 + column * spacing + (row & 1 ? spacing * .5 : 0) + (random() - .5) * .018; y = .5 + row * spacing * .866 + (random() - .5) * .018;
    } else if (composition === 10) {
      const petals = 8 + (words[1] % 9); const petalAngle = angle + phase; const petalRadius = .08 + Math.pow(random(), .72) * (.18 + Math.abs(Math.sin(petalAngle * petals)) * .19);
      x = .5 + Math.cos(petalAngle) * petalRadius; y = .5 + Math.sin(petalAngle) * petalRadius;
    } else if (composition === 11) {
      const fanAngle = Math.PI * (1.12 + random() * .76) + tilt; const fanRadius = .05 + Math.pow(random(), .58) * .55;
      x = .5 + Math.cos(fanAngle) * fanRadius; y = .84 + Math.sin(fanAngle) * fanRadius * .86;
    } else if (composition === 12) {
      x = random(); const river = Math.floor(random() * (6 + words[1] % 5));
      y = .1 + river * .11 + Math.sin(x * (8 + arms) + phase + river * .83) * .055 + Math.sin(x * 31 - phase) * .014 + (random() - .5) * .016;
    } else if (composition === 8) {
      if (random() < .34) {
        const contour: [number, number][] = [[.46,.16],[.41,.23],[.4,.31],[.33,.37],[.29,.405],[.38,.42],[.34,.46],[.395,.485],[.42,.56],[.48,.66],[.55,.77]];
        const position = random() * (contour.length - 1); const index = Math.floor(position); const amount = position - index; const next = Math.min(contour.length - 1, index + 1);
        const px = contour[index][0] + (contour[next][0] - contour[index][0]) * amount; const py = contour[index][1] + (contour[next][1] - contour[index][1]) * amount;
        const jitter = (random() - .5) * (.012 + features.pressureMean * .022); x = px + jitter; y = py + (random() - .5) * .012;
      } else {
        const hairAngle = angle + Math.sin(angle * 3 + phase) * .22; const hairRadius = .12 + Math.pow(random(), .7) * .31;
        x = .57 + Math.cos(hairAngle) * hairRadius * (1 + features.coverage * .25); y = .45 + Math.sin(hairAngle) * hairRadius * .92;
      }
    } else if (composition === 1) {
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
    } else if (composition === 5) {
      const traceIndex = Math.floor(random() * traceCount); const nextIndex = Math.min(traceCount - 1, traceIndex + 1);
      const tx = trace[traceIndex * 2], ty = trace[traceIndex * 2 + 1]; const direction = Math.atan2(trace[nextIndex * 2 + 1] - ty, trace[nextIndex * 2] - tx);
      const offset = (random() - .5) * (.035 + features.pressureMean * .09);
      x = tx + Math.cos(direction + Math.PI / 2) * offset; y = ty + Math.sin(direction + Math.PI / 2) * offset;
    } else if (composition === 6) {
      const petals = 3 + ((features.taps + words[1]) % 8); const roseRadius = .2 + Math.cos(angle * petals + phase) * .15 + (random() - .5) * .035;
      x = .5 + Math.cos(angle + tilt) * roseRadius; y = .5 + Math.sin(angle + tilt) * roseRadius;
    } else if (composition === 7) {
      const nodeCount = tapCount || traceCount; const nodeIndex = Math.floor(random() * nodeCount);
      const nx = tapCount ? taps[nodeIndex * 2] : trace[nodeIndex * 2]; const ny = tapCount ? taps[nodeIndex * 2 + 1] : trace[nodeIndex * 2 + 1];
      const nodeRadius = Math.pow(random(), 1.8) * (.035 + features.pressureMean * .06);
      x = nx + Math.cos(angle) * nodeRadius; y = ny + Math.sin(angle) * nodeRadius;
    } else {
      x = 0.5 + Math.cos(angle) * radius * (0.78 + features.coverage * 0.35);
      y = 0.5 + Math.sin(angle) * radius;
    }
    starts[i * 2] = x; starts[i * 2 + 1] = y;
    for (let step = 0; step < config.steps; step++) {
      const cx = x - 0.5, cy = y - 0.5;
      const polar = Math.atan2(cy, cx), r = Math.hypot(cx, cy);
      let field: number;
      if (composition === 9) {
        const gridAngle = Math.round((polar + phase) / (Math.PI / 3)) * Math.PI / 3; field = gridAngle + Math.sin((x + y) * 36 + phase) * .18;
      } else if (composition === 10) {
        const petals = 8 + (words[1] % 9); const targetRadius = .09 + Math.abs(Math.sin(polar * petals + phase)) * .27;
        field = polar + Math.PI / 2 + (targetRadius - r) * 4.8 + Math.sin(polar * petals * 2 + phase) * .23;
      } else if (composition === 11) {
        const originX = x - .5, originY = y - .84; const fanPolar = Math.atan2(originY, originX); field = fanPolar + Math.PI / 2 + Math.sin(fanPolar * (6 + arms) + phase) * .22;
      } else if (composition === 12) {
        field = Math.sin(x * (10 + arms) + phase) * .23 + Math.cos(y * 22 - phase) * .07 + tilt;
      } else if (composition === 8) {
        const hairX = x - .58, hairY = y - .45; const hairPolar = Math.atan2(hairY, hairX); const facePull = Math.atan2(.44 - y, .39 - x);
        field = hairPolar + Math.PI / 2 + Math.sin(hairPolar * (4 + arms) + Math.hypot(hairX, hairY) * 29 + phase) * .5;
        if (x < .48) field = Math.atan2(Math.sin(field) * .35 + Math.sin(facePull) * .65, Math.cos(field) * .35 + Math.cos(facePull) * .65);
      } else if (composition === 1) {
        const focusX = x < .5 ? .31 : .69; const localX = x - focusX; const localY = y - .5; const localPolar = Math.atan2(localY, localX);
        field = localPolar + Math.PI / 2 + Math.sin(localPolar * arms + Math.hypot(localX, localY) * 38 + phase) * .48 + (x < .5 ? .12 : -.12);
      } else if (composition === 2) {
        field = tilt + Math.sin(x * (12 + arms) + y * 16 + phase) * .22 + Math.cos(y * 31 - phase) * .09;
      } else if (composition === 3) {
        const ringTarget = .2 + (words[1] % 5) * .025; const correction = (ringTarget - r) * 3.4;
        field = polar + Math.PI / 2 + correction + Math.sin(polar * arms + phase) * .3;
      } else if (composition === 4) {
        field = Math.sin(x * 11 + phase) * 1.1 + Math.cos(y * 13 - phase) * .85 + tilt + Math.sin((x + y) * 19) * .22;
      } else if (composition === 5) {
        const base = Math.floor((i / count) * Math.max(1, traceCount - 1)); const targetIndex = Math.min(traceCount - 1, base + Math.floor(step * traceCount / config.steps));
        const tx = trace[targetIndex * 2], ty = trace[targetIndex * 2 + 1];
        field = Math.atan2(ty - y, tx - x) + Math.sin(step * .55 + i * .013 + phase) * (.12 + entropy * .16);
      } else if (composition === 6) {
        const petals = 3 + ((features.taps + words[1]) % 8); const targetRadius = .2 + Math.cos(polar * petals + phase) * .15;
        field = polar + Math.PI / 2 + (targetRadius - r) * 4.2 + Math.sin(polar * petals * 2) * .16;
      } else if (composition === 7) {
        const nodeCount = tapCount || traceCount; const nodeIndex = (i + step * 3) % nodeCount;
        const nx = tapCount ? taps[nodeIndex * 2] : trace[nodeIndex * 2]; const ny = tapCount ? taps[nodeIndex * 2 + 1] : trace[nodeIndex * 2 + 1];
        const toNode = Math.atan2(ny - y, nx - x); field = toNode + Math.sin(step * .32 + phase) * .38 + Math.PI * .08;
      } else {
        const wave = Math.sin((polar * arms) + r * config.fieldScale * 20 + phase);
        field = polar + Math.PI / 2 + wave * config.turbulence + Math.sin(y * 19 + x * 11) * 0.12 * entropy;
      }
      if (composition < 5 || composition === 8 || composition === 9 || composition === 10 || composition === 11 || composition === 12) {
        const traceIndex = (i + step * 7) % traceCount; const pullAngle = Math.atan2(trace[traceIndex * 2 + 1] - y, trace[traceIndex * 2] - x);
        const pull = .06 + Math.min(.2, features.averageCurvature * .0015) + features.pressureMean * .08;
        field = Math.atan2(Math.sin(field) + Math.sin(pullAngle) * pull, Math.cos(field) + Math.cos(pullAngle) * pull);
      }
      const length = config.stepLength * (0.72 + random() * 0.56) * (1 + features.averageSpeed * 0.025) * (.9 + features.pressureMean * .3);
      x += Math.cos(field) * length; y += Math.sin(field) * length;
      if (x < 0 || x > 1 || y < 0 || y > 1) break;
    }
    ends[i * 2] = x; ends[i * 2 + 1] = y; tones[i] = Math.floor(random() * 255);
  }
  return { starts, ends, tones, trace, taps, composition };
}
