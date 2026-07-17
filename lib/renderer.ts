import type { ParticleFrame } from "./simulation";

type RGB = [number, number, number];
export interface RenderConfig { size: number; background: string; gold: RGB; palette?: RGB[]; lineAlpha: number; lineWidth: number; }
export const DEFAULT_RENDER: RenderConfig = {
  size: 4096,
  background: "#05040a",
  gold: [238, 196, 92],
  palette: [[245, 199, 90], [255, 91, 168], [119, 103, 255], [52, 211, 198], [255, 143, 82]],
  lineAlpha: 0.18,
  lineWidth: 0.52,
};

function mix(a: RGB, b: RGB, amount: number): RGB {
  return a.map((value, index) => Math.round(value + (b[index] - value) * amount)) as RGB;
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
  const count = frame.tones.length;
  for (let i = 0; i < count; i++) {
    const tone = frame.tones[i] / 255;
    const scaled = tone * (palette.length - 1); const left = Math.floor(scaled); const color = mix(palette[left], palette[Math.min(palette.length - 1, left + 1)], scaled - left);
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${config.lineAlpha * (.48 + tone * .8)})`;
    ctx.lineWidth = config.lineWidth * (0.65 + tone * 0.8);
    if (i % 211 === 0) { ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},.9)`; ctx.shadowBlur = config.size * .009; } else { ctx.shadowBlur = 0; }
    ctx.beginPath(); ctx.moveTo(frame.starts[i * 2] * config.size, frame.starts[i * 2 + 1] * config.size); ctx.lineTo(frame.ends[i * 2] * config.size, frame.ends[i * 2 + 1] * config.size); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  for (let i = 17; i < count; i += 73) {
    const tone = frame.tones[i] / 255; if (tone < .58) continue;
    const x = frame.ends[i * 2] * config.size, y = frame.ends[i * 2 + 1] * config.size; const radius = config.size * (.00028 + tone * .00055);
    ctx.fillStyle = tone > .84 ? "rgba(255,246,204,.92)" : "rgba(255,174,219,.72)";
    ctx.shadowColor = tone > .84 ? "#ffe9a6" : "#ff5fb6"; ctx.shadowBlur = radius * 8;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  const vignette = ctx.createRadialGradient(config.size / 2, config.size / 2, config.size * .25, config.size / 2, config.size / 2, config.size * .72);
  vignette.addColorStop(0, "transparent"); vignette.addColorStop(1, "rgba(0,0,0,.52)"); ctx.fillStyle = vignette; ctx.fillRect(0, 0, config.size, config.size);
}
