import type { ParticleFrame } from "./simulation";
import { royalHouseFromWords } from "./houses";

type RGB = [number, number, number];
export interface RenderConfig { size: number; background: string; gold: RGB; palette?: RGB[]; lineAlpha: number; lineWidth: number; ornament?: "arch" | "stars" | "lattice" | "lotus" | "sunburst"; accent?: string; }
export const DEFAULT_RENDER: RenderConfig = {
  size: 4096,
  background: "#05040a",
  gold: [238, 196, 92],
  palette: [[245, 199, 90], [255, 91, 168], [119, 103, 255], [52, 211, 198], [255, 143, 82]],
  lineAlpha: 0.18,
  lineWidth: 0.52,
};

export function renderConfigForHouse(words: readonly number[], size = 4096): RenderConfig {
  const house = royalHouseFromWords(words);
  return { ...DEFAULT_RENDER, size, background: house.background, gold: house.palette[0], palette: house.palette, ornament: house.ornament, accent: house.primary };
}

function mix(a: RGB, b: RGB, amount: number): RGB {
  return a.map((value, index) => Math.round(value + (b[index] - value) * amount)) as RGB;
}

function drawRoyalOrnament(ctx: CanvasRenderingContext2D, config: RenderConfig) {
  const size = config.size, margin = size * .035; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = config.accent || "#f2c65c"; ctx.lineWidth = size * .00055; ctx.globalAlpha = .38; ctx.shadowColor = config.accent || "#f2c65c"; ctx.shadowBlur = size * .006;
  ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2); ctx.globalAlpha = .18; ctx.strokeRect(margin * 1.35, margin * 1.35, size - margin * 2.7, size - margin * 2.7);
  if (config.ornament === "arch") { for (let i = 0; i < 9; i++) { const x = margin + (size - margin * 2) * i / 8; ctx.beginPath(); ctx.arc(x, margin, size * .035, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(x, size - margin, size * .035, Math.PI, Math.PI * 2); ctx.stroke(); } }
  if (config.ornament === "stars") { for (let i = 0; i < 24; i++) { const a = i * Math.PI * 2 / 24, radius = size * .43; const x = size / 2 + Math.cos(a) * radius, y = size / 2 + Math.sin(a) * radius; ctx.beginPath(); ctx.moveTo(x - size * .006, y); ctx.lineTo(x + size * .006, y); ctx.moveTo(x, y - size * .006); ctx.lineTo(x, y + size * .006); ctx.stroke(); } }
  if (config.ornament === "lattice") { for (let i = 0; i < 12; i++) { const p = margin + i * (size - margin * 2) / 11; ctx.beginPath(); ctx.moveTo(margin, p); ctx.lineTo(p, margin); ctx.moveTo(size - margin, p); ctx.lineTo(size - p, margin); ctx.moveTo(margin, size - p); ctx.lineTo(p, size - margin); ctx.moveTo(size - margin, size - p); ctx.lineTo(size - p, size - margin); ctx.stroke(); } }
  if (config.ornament === "lotus") { for (let i = 0; i < 16; i++) { const a = i * Math.PI * 2 / 16; ctx.beginPath(); ctx.ellipse(size / 2 + Math.cos(a) * size * .425, size / 2 + Math.sin(a) * size * .425, size * .022, size * .052, a + Math.PI / 2, 0, Math.PI * 2); ctx.stroke(); } }
  if (config.ornament === "sunburst") { for (let i = 0; i < 48; i++) { const a = i * Math.PI * 2 / 48; const r1 = size * .425, r2 = r1 + size * (i % 2 ? .018 : .03); ctx.beginPath(); ctx.moveTo(size / 2 + Math.cos(a) * r1, size / 2 + Math.sin(a) * r1); ctx.lineTo(size / 2 + Math.cos(a) * r2, size / 2 + Math.sin(a) * r2); ctx.stroke(); } }
  ctx.restore();
}

export function renderArtwork(canvas: HTMLCanvasElement, frame: ParticleFrame, config: RenderConfig = DEFAULT_RENDER): void {
  canvas.width = config.size; canvas.height = config.size;
  const ctx = canvas.getContext("2d", { alpha: false }); if (!ctx) return;
  ctx.fillStyle = config.background; ctx.fillRect(0, 0, config.size, config.size);
  const aura = ctx.createRadialGradient(config.size * .55, config.size * .48, 0, config.size * .55, config.size * .48, config.size * .68);
  aura.addColorStop(0, "rgba(79,45,145,.22)"); aura.addColorStop(.38, "rgba(17,122,133,.09)"); aura.addColorStop(.72, "rgba(156,36,100,.07)"); aura.addColorStop(1, "transparent");
  ctx.fillStyle = aura; ctx.fillRect(0, 0, config.size, config.size);
  if (frame.trace.length >= 4) {
    ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const layer of [{ width: .026, alpha: .025, blur: .035 }, { width: .009, alpha: .07, blur: .016 }, { width: .0012, alpha: .3, blur: .005 }]) {
      ctx.beginPath(); ctx.moveTo(frame.trace[0] * config.size, frame.trace[1] * config.size);
      for (let i = 2; i < frame.trace.length; i += 2) ctx.lineTo(frame.trace[i] * config.size, frame.trace[i + 1] * config.size);
      ctx.strokeStyle = `rgba(255,112,190,${layer.alpha})`; ctx.lineWidth = config.size * layer.width; ctx.shadowColor = "#8d72ff"; ctx.shadowBlur = config.size * layer.blur; ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  ctx.lineCap = "round"; ctx.globalCompositeOperation = "lighter";
  const palette = config.palette || [[config.gold[0], config.gold[1], config.gold[2]], [255, 92, 170], [97, 206, 220], [142, 110, 255]];
  const count = frame.tones.length;
  const toneBins = 24;
  const paths = Array.from({ length: toneBins }, () => new Path2D());
  for (let i = 0; i < count; i++) {
    const tone = frame.tones[i] / 255;
    const sx = frame.starts[i * 2] * config.size, sy = frame.starts[i * 2 + 1] * config.size, ex = frame.ends[i * 2] * config.size, ey = frame.ends[i * 2 + 1] * config.size;
    const dx = ex - sx, dy = ey - sy; const bend = (((frame.tones[(i + 31) % count] / 255) - .5) * .34) + (frame.composition === 8 ? .12 : 0);
    const path = paths[Math.min(toneBins - 1, Math.floor(tone * toneBins))]; path.moveTo(sx, sy); path.quadraticCurveTo((sx + ex) * .5 - dy * bend, (sy + ey) * .5 + dx * bend, ex, ey);
  }
  ctx.shadowBlur = 0;
  for (let bin = 0; bin < toneBins; bin++) {
    const tone = (bin + .5) / toneBins; const scaled = tone * (palette.length - 1); const left = Math.floor(scaled); const color = mix(palette[left], palette[Math.min(palette.length - 1, left + 1)], scaled - left);
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${config.lineAlpha * (.48 + tone * .8)})`; ctx.lineWidth = config.lineWidth * (.65 + tone * .8); ctx.stroke(paths[bin]);
  }
  ctx.shadowBlur = 0;
  for (let i = 17; i < count; i += 73) {
    const tone = frame.tones[i] / 255; if (tone < .58) continue;
    const x = frame.ends[i * 2] * config.size, y = frame.ends[i * 2 + 1] * config.size; const radius = config.size * (.00028 + tone * .00055);
    ctx.fillStyle = tone > .84 ? "rgba(255,246,204,.92)" : "rgba(255,174,219,.72)";
    ctx.shadowColor = tone > .84 ? "#ffe9a6" : "#ff5fb6"; ctx.shadowBlur = radius * 8;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 11; i < count; i += 29) {
    const tone = frame.tones[i] / 255; const x = frame.ends[i * 2] * config.size, y = frame.ends[i * 2 + 1] * config.size;
    const color = palette[Math.floor(tone * palette.length) % palette.length]; const radius = config.size * (.00012 + tone * .00036);
    ctx.globalAlpha = .18 + tone * .48; ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = radius * 5;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (let i = 101; i < count; i += 997) {
    const x = frame.ends[i * 2] * config.size, y = frame.ends[i * 2 + 1] * config.size, radius = config.size * (.0025 + (frame.tones[i] / 255) * .0038);
    ctx.strokeStyle = "rgba(255,242,190,.78)"; ctx.lineWidth = config.size * .00032; ctx.shadowColor = "#ffe49a"; ctx.shadowBlur = radius * 3;
    ctx.beginPath(); ctx.moveTo(x - radius, y); ctx.lineTo(x + radius, y); ctx.moveTo(x, y - radius); ctx.lineTo(x, y + radius); ctx.moveTo(x - radius * .45, y - radius * .45); ctx.lineTo(x + radius * .45, y + radius * .45); ctx.moveTo(x + radius * .45, y - radius * .45); ctx.lineTo(x - radius * .45, y + radius * .45); ctx.stroke();
  }
  for (let i = 0; i < frame.taps.length; i += 2) {
    const x = frame.taps[i] * config.size, y = frame.taps[i + 1] * config.size; const base = config.size * (.007 + (i % 6) * .0015);
    for (let ring = 1; ring <= 3; ring++) { ctx.strokeStyle = `rgba(${ring === 2 ? "255,100,185" : "255,222,126"},${.2 / ring})`; ctx.lineWidth = config.size * .00045; ctx.shadowColor = ring === 2 ? "#ff5ca8" : "#ffd978"; ctx.shadowBlur = config.size * .006; ctx.beginPath(); ctx.arc(x, y, base * ring, 0, Math.PI * 2); ctx.stroke(); }
  }
  drawRoyalOrnament(ctx, config);
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  const vignette = ctx.createRadialGradient(config.size / 2, config.size / 2, config.size * .25, config.size / 2, config.size / 2, config.size * .72);
  vignette.addColorStop(0, "transparent"); vignette.addColorStop(1, "rgba(0,0,0,.52)"); ctx.fillStyle = vignette; ctx.fillRect(0, 0, config.size, config.size);
}
