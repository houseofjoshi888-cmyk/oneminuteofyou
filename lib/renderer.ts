import type { ParticleFrame } from "./simulation";

export interface RenderConfig { size: number; background: string; gold: [number, number, number]; lineAlpha: number; lineWidth: number; }
export const DEFAULT_RENDER: RenderConfig = { size: 4096, background: "#070706", gold: [202, 166, 81], lineAlpha: 0.14, lineWidth: 0.52 };

export function renderArtwork(canvas: HTMLCanvasElement, frame: ParticleFrame, config: RenderConfig = DEFAULT_RENDER): void {
  canvas.width = config.size; canvas.height = config.size;
  const ctx = canvas.getContext("2d", { alpha: false }); if (!ctx) return;
  ctx.fillStyle = config.background; ctx.fillRect(0, 0, config.size, config.size);
  ctx.lineCap = "round"; ctx.globalCompositeOperation = "lighter";
  const count = frame.tones.length;
  for (let i = 0; i < count; i++) {
    const tone = frame.tones[i] / 255;
    const lift = Math.round(tone * 40);
    ctx.strokeStyle = `rgba(${config.gold[0] + lift},${config.gold[1] + lift},${config.gold[2] + Math.round(lift * .6)},${config.lineAlpha * (.55 + tone * .75)})`;
    ctx.lineWidth = config.lineWidth * (0.65 + tone * 0.8);
    ctx.beginPath(); ctx.moveTo(frame.starts[i * 2] * config.size, frame.starts[i * 2 + 1] * config.size); ctx.lineTo(frame.ends[i * 2] * config.size, frame.ends[i * 2 + 1] * config.size); ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
  const vignette = ctx.createRadialGradient(config.size / 2, config.size / 2, config.size * .25, config.size / 2, config.size / 2, config.size * .72);
  vignette.addColorStop(0, "transparent"); vignette.addColorStop(1, "rgba(0,0,0,.52)"); ctx.fillStyle = vignette; ctx.fillRect(0, 0, config.size, config.size);
}
