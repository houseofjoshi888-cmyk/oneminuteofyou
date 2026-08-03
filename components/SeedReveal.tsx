"use client";

import { useEffect, useRef, useState } from "react";
import { drawProvenanceSeal } from "@/lib/provenance";
import type { RoyalHouse } from "@/lib/houses";

function drawEmergence(canvas: HTMLCanvasElement, hash: string, primary: string, secondary: string, phase: number) {
  const size = 900; canvas.width = size; canvas.height = size; const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.clearRect(0, 0, size, size); const count = phase === 0 ? 1 : phase === 1 ? 14 : phase === 2 ? 76 : 260;
  ctx.save(); ctx.translate(size / 2, size / 2); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < count; i++) {
    const seed = Number.parseInt(hash.slice((i * 3) % 56, (i * 3) % 56 + 2), 16) / 255;
    const a = i * 2.399963229728653 + seed * Math.PI * 2;
    const radius = phase === 0 ? 0 : Math.sqrt(i / count) * size * .43;
    const x = Math.cos(a) * radius, y = Math.sin(a) * radius;
    const length = size * (.018 + seed * .055) * (phase + 1) / 4;
    ctx.strokeStyle = i % 3 ? primary : secondary; ctx.globalAlpha = .1 + phase * .09 + seed * .13; ctx.lineWidth = 1 + seed * 2.2;
    ctx.shadowColor = i % 3 ? primary : secondary; ctx.shadowBlur = 7 + seed * 14;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a + .55) * length, y + Math.sin(a + .55) * length, x + Math.cos(a - .18) * length * 1.8, y + Math.sin(a - .18) * length * 1.8); ctx.stroke();
  }
  ctx.globalAlpha = .95; ctx.fillStyle = secondary; ctx.shadowColor = primary; ctx.shadowBlur = 32; ctx.beginPath(); ctx.arc(0, 0, 3 + phase * 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}

export function SeedReveal({ hash, house, onComplete }: { hash: string; house: RoyalHouse; onComplete: () => void }) {
  const seal = useRef<HTMLCanvasElement>(null);
  const growth = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [cipher, setCipher] = useState(hash.slice(0, 16));
  useEffect(() => {
    if (seal.current) drawProvenanceSeal(seal.current, hash, house.primary, house.secondary, 900);
    const alphabet = "0123456789ABCDEF";
    let tick = 0;
    const scramble = window.setInterval(() => {
      tick += 1;
      setCipher(Array.from({ length: 16 }, (_, index) => index < Math.floor(tick / 3) ? hash[index].toUpperCase() : alphabet[(tick * 7 + index * 11) % 16]).join(""));
      if (tick >= 48) window.clearInterval(scramble);
    }, 45);
    const stages = [window.setTimeout(() => setPhase(1), 800), window.setTimeout(() => setPhase(2), 2200), window.setTimeout(() => setPhase(3), 4100), window.setTimeout(onComplete, 6100)];
    return () => { window.clearInterval(scramble); stages.forEach(window.clearTimeout); };
  }, [hash, house, onComplete]);
  useEffect(() => { if (growth.current) drawEmergence(growth.current, hash, house.primary, house.secondary, phase); }, [hash, house.primary, house.secondary, phase]);
  return <section className={`seed-reveal reveal-phase-${phase}`} style={{ "--house-primary": house.primary, "--house-secondary": house.secondary } as React.CSSProperties}>
    <div className="reveal-stars" />
    <canvas className="reveal-growth" ref={growth} aria-hidden="true" />
    <p className="eyebrow"><span /> THE MINUTE IS COMPLETE</p>
    <div className="reveal-seal"><canvas ref={seal} /><i /></div>
    <p className="reveal-step">{phase < 1 ? "Silence…" : phase < 2 ? "Finding hidden order…" : phase < 3 ? "Extracting rhythm · growing the field…" : "This has never existed before."}</p>
    <code>{cipher.slice(0, 8)} · {cipher.slice(8)}</code>
    <h2>{phase < 3 ? "A single point gathers, branches, and settles." : `${house.name} claims your minute.`}</h2>
    <button className="reveal-skip" onClick={onComplete}>Reveal now</button>
  </section>;
}
