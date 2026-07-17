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

function drawPatternMotif(ctx: CanvasRenderingContext2D, composition: number, config: RenderConfig) {
  if (composition < 9) return;
  const size = config.size; const accent = config.accent || "#f2c65c"; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = size * .007; ctx.lineWidth = size * .00038; ctx.globalAlpha = .22;
  if (composition === 9) {
    const radius = size * .055, dx = radius * 1.5, dy = radius * 1.3;
    for (let row = -1; row < 10; row++) for (let column = -1; column < 10; column++) { const x = size * .08 + column * dx + (row & 1 ? dx * .5 : 0), y = size * .08 + row * dy; ctx.beginPath(); for (let side = 0; side <= 6; side++) { const a = Math.PI / 6 + side * Math.PI / 3; const px = x + Math.cos(a) * radius, py = y + Math.sin(a) * radius; if (!side) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); }
  }
  if (composition === 10) {
    for (let petal = 0; petal < 20; petal++) { const a = petal * Math.PI * 2 / 20, radius = size * (.34 + (petal % 3) * .035); ctx.beginPath(); ctx.ellipse(size / 2 + Math.cos(a) * radius * .42, size / 2 + Math.sin(a) * radius * .42, size * .04, radius, a, 0, Math.PI * 2); ctx.stroke(); }
  }
  if (composition === 11) {
    const ox = size * .5, oy = size * .86; for (let ring = 1; ring < 8; ring++) { ctx.beginPath(); ctx.arc(ox, oy, size * (.08 + ring * .06), Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } for (let ray = 0; ray < 22; ray++) { const a = Math.PI * (1.1 + ray * .8 / 21); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * size * .5, oy + Math.sin(a) * size * .5); ctx.stroke(); }
  }
  if (composition === 12) {
    for (let line = 0; line < 13; line++) { ctx.beginPath(); for (let step = 0; step <= 80; step++) { const x = step / 80 * size; const y = size * (.1 + line * .065) + Math.sin(step * .19 + line * .83) * size * .035 + Math.sin(step * .53 - line) * size * .012; if (!step) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
  }
  ctx.restore();
}

function drawSurfacePattern(ctx: CanvasRenderingContext2D, frame: ParticleFrame, config: RenderConfig, palette: RGB[]) {
  const size = config.size; const tone = (index: number) => frame.tones[index % frame.tones.length] / 255; const color = (index: number) => palette[Math.min(palette.length - 1, Math.floor(tone(index) * palette.length))];
  ctx.save(); ctx.globalCompositeOperation = "source-over";
  if (frame.composition === 13) {
    const cells = 9; const unit = size / cells; for (let row = 0; row < cells; row++) for (let column = 0; column < cells; column++) { const c = color(row * cells + column); const x = column * unit, y = row * unit; ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; ctx.globalAlpha = .35 + tone(row * 7 + column) * .48; ctx.fillRect(x + unit * .06, y + unit * .06, unit * .88, unit * .88); ctx.fillStyle = config.background; ctx.globalAlpha = .48; ctx.beginPath(); ctx.moveTo(x + unit * .5, y + unit * .16); ctx.lineTo(x + unit * .84, y + unit * .5); ctx.lineTo(x + unit * .5, y + unit * .84); ctx.lineTo(x + unit * .16, y + unit * .5); ctx.closePath(); ctx.fill(); }
  }
  if (frame.composition === 14) {
    ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; for (let ribbon = 0; ribbon < 28; ribbon++) { const c = color(ribbon * 3); ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${.16 + tone(ribbon) * .36})`; ctx.lineWidth = size * (.006 + tone(ribbon + 8) * .014); ctx.beginPath(); const y = size * (.04 + ribbon * .034); ctx.moveTo(-size * .06, y); ctx.bezierCurveTo(size * .25, y - size * (.16 + tone(ribbon) * .12), size * .72, y + size * (.18 + tone(ribbon + 4) * .1), size * 1.08, y + Math.sin(ribbon) * size * .08); ctx.stroke(); }
  }
  if (frame.composition === 15) {
    const cells = 7; const unit = size / cells; ctx.globalAlpha = .78; for (let row = 0; row < cells; row++) for (let column = 0; column < cells; column++) { const c = color(row * cells + column); const x = column * unit, y = row * unit; const inset = unit * (.08 + tone(row + column) * .12); ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; ctx.beginPath(); ctx.moveTo(x + inset, y + unit * .12); ctx.lineTo(x + unit - inset, y + inset); ctx.lineTo(x + unit * (.82 + tone(row * 2) * .09), y + unit - inset); ctx.lineTo(x + inset, y + unit * (.86 - tone(column) * .1)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = config.background; ctx.lineWidth = size * .004; ctx.stroke(); }
  }
  if (frame.composition === 16) {
    ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; for (let line = 0; line < 32; line++) { const c = color(line); ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${.24 + tone(line) * .38})`; ctx.lineWidth = size * (.0007 + tone(line + 3) * .0014); ctx.beginPath(); for (let step = 0; step <= 120; step++) { const x = step / 120 * size; const y = size * (.06 + line * .028) + Math.sin(step * .15 + line * .71) * size * (.018 + tone(line) * .02) + Math.sin(step * .041 - line) * size * .035; if (!step) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
  }
  if (frame.composition === 17) {
    // A seeded gesture, rather than a literal replay of the owner's hand.
    ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let layer = 0; layer < 7; layer++) { const c = color(layer * 5); const phase = tone(layer + 2) * Math.PI * 2; ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${.12 + layer * .045})`; ctx.lineWidth = size * (.0028 + layer * .0023); ctx.beginPath(); for (let step = 0; step <= 180; step++) { const t = step / 180; const x = size * (.09 + t * .82); const y = size * (.5 + Math.sin(t * Math.PI * (1.3 + layer * .17) + phase) * (.13 + tone(layer) * .13) + Math.sin(t * Math.PI * (4 + layer) - phase) * .035 + (layer - 3) * .026); if (!step) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
  }
  ctx.restore();
}

export function renderArtwork(canvas: HTMLCanvasElement, frame: ParticleFrame, config: RenderConfig = DEFAULT_RENDER): void {
  canvas.width = config.size; canvas.height = config.size;
  const ctx = canvas.getContext("2d", { alpha: false }); if (!ctx) return;
  ctx.fillStyle = config.background; ctx.fillRect(0, 0, config.size, config.size);
  const aura = ctx.createRadialGradient(config.size * .55, config.size * .48, 0, config.size * .55, config.size * .48, config.size * .68);
  aura.addColorStop(0, "rgba(79,45,145,.22)"); aura.addColorStop(.38, "rgba(17,122,133,.09)"); aura.addColorStop(.72, "rgba(156,36,100,.07)"); aura.addColorStop(1, "transparent");
  ctx.fillStyle = aura; ctx.fillRect(0, 0, config.size, config.size);
  ctx.lineCap = "round"; ctx.globalCompositeOperation = "lighter";
  const palette = config.palette || [[config.gold[0], config.gold[1], config.gold[2]], [255, 92, 170], [97, 206, 220], [142, 110, 255]];
  if (frame.composition >= 13) {
    drawSurfacePattern(ctx, frame, config, palette); drawRoyalOrnament(ctx, config); ctx.globalCompositeOperation = "source-over";
    const vignette = ctx.createRadialGradient(config.size / 2, config.size / 2, config.size * .25, config.size / 2, config.size / 2, config.size * .72); vignette.addColorStop(0, "transparent"); vignette.addColorStop(1, "rgba(0,0,0,.52)"); ctx.fillStyle = vignette; ctx.fillRect(0, 0, config.size, config.size); return;
  }
  const count = frame.tones.length;
  const toneBins = 24;
  const supportsPath2D = typeof Path2D !== "undefined";
  const paths = supportsPath2D ? Array.from({ length: toneBins }, () => new Path2D()) : null;
  for (let i = 0; i < count; i++) {
    const tone = frame.tones[i] / 255;
    const sx = frame.starts[i * 2] * config.size, sy = frame.starts[i * 2 + 1] * config.size, ex = frame.ends[i * 2] * config.size, ey = frame.ends[i * 2 + 1] * config.size;
    const dx = ex - sx, dy = ey - sy; const bend = (((frame.tones[(i + 31) % count] / 255) - .5) * .34) + (frame.composition === 8 ? .12 : 0);
    if (paths) {
      const path = paths[Math.min(toneBins - 1, Math.floor(tone * toneBins))]; path.moveTo(sx, sy); path.quadraticCurveTo((sx + ex) * .5 - dy * bend, (sy + ey) * .5 + dx * bend, ex, ey);
    } else {
      const scaled = tone * (palette.length - 1); const left = Math.floor(scaled); const color = mix(palette[left], palette[Math.min(palette.length - 1, left + 1)], scaled - left);
      ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${config.lineAlpha * (.48 + tone * .8)})`; ctx.lineWidth = config.lineWidth * (.65 + tone * .8); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex) * .5 - dy * bend, (sy + ey) * .5 + dx * bend, ex, ey); ctx.stroke();
    }
  }
  ctx.shadowBlur = 0;
  for (let bin = 0; paths && bin < toneBins; bin++) {
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
  drawPatternMotif(ctx, frame.composition, config);
  drawRoyalOrnament(ctx, config);
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  const vignette = ctx.createRadialGradient(config.size / 2, config.size / 2, config.size * .25, config.size / 2, config.size / 2, config.size * .72);
  vignette.addColorStop(0, "transparent"); vignette.addColorStop(1, "rgba(0,0,0,.52)"); ctx.fillStyle = vignette; ctx.fillRect(0, 0, config.size, config.size);
}
