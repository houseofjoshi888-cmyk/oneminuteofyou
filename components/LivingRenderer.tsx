"use client";

import { useEffect, useRef, useState } from "react";
import type { InteractionFeatures } from "@/lib/analyzer";
import { drawMathematicalHousePattern, renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { compositionFor, isSurfaceComposition, PREVIEW_SIMULATION, SURFACE_SIMULATION, simulateParticles } from "@/lib/simulation";
import { royalHouseFromWords } from "@/lib/houses";

export function LivingRenderer({ words, features, onReady }: { words: [number, number, number, number]; features: InteractionFeatures; onReady?: (canvas: HTMLCanvasElement) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [living, setLiving] = useState(true);
  const livingRef = useRef(true);
  const cycleStartedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let raf = 0, active = true, lastFrame = -Infinity;
    const frame = simulateParticles(words, features, isSurfaceComposition(compositionFor(words, features)) ? SURFACE_SIMULATION : PREVIEW_SIMULATION);
    const house = royalHouseFromWords(words);
    const generated = document.createElement("canvas");
    const base = document.createElement("canvas");

    const begin = () => {
      if (!active) return;
      try {
        const config = { ...renderConfigForHouse(words, 1024), lineAlpha: .78, lineWidth: 1.45 };
        renderArtwork(generated, frame, config);
        base.width = 1024; base.height = 1024;
        const baseContext = base.getContext("2d"); if (!baseContext) throw new Error("Canvas unavailable");
        baseContext.fillStyle = house.background; baseContext.fillRect(0, 0, 1024, 1024);
        drawMathematicalHousePattern(baseContext, frame, config);
        baseContext.save(); baseContext.globalCompositeOperation = "screen"; baseContext.globalAlpha = 1; baseContext.drawImage(generated, 0, 0); baseContext.restore();

        canvas.width = 1024; canvas.height = 1024;
        const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas unavailable");
        const dustMask = document.createElement("canvas"), formationLayer = document.createElement("canvas");
        dustMask.width = formationLayer.width = 1024; dustMask.height = formationLayer.height = 1024;
        const dustContext = dustMask.getContext("2d"), formationContext = formationLayer.getContext("2d");
        if (!dustContext || !formationContext) throw new Error("Canvas unavailable");
        const formationDuration = 10_000, holdDuration = 4_000, duration = formationDuration + holdDuration, waveDuration = 56_000;
        const dustCount = 14_000;
        let revealedDust = 0, previousElapsed = 0;
        cycleStartedRef.current = performance.now(); setRenderError(false); setRendering(false); onReady?.(base);
        const draw = (now: number) => {
          if (!active) return; raf = requestAnimationFrame(draw); if (now - lastFrame < 33) return; lastFrame = now;
          ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
          if (livingRef.current) {
            const elapsed = (now - cycleStartedRef.current) % duration;
            const rawFormation = Math.min(1, elapsed / formationDuration);
            const formation = .5 - Math.cos(rawFormation * Math.PI) * .5;
            if (elapsed < previousElapsed) { dustContext.clearRect(0, 0, 1024, 1024); revealedDust = 0; }
            previousElapsed = elapsed;
            const targetDust = Math.floor(formation * dustCount);
            dustContext.fillStyle = "#fff"; dustContext.beginPath();
            for (let particle = revealedDust; particle < targetDust; particle++) {
              const index = ((Math.imul(particle, 73) + words[0]) >>> 0) % frame.tones.length;
              const amount = ((Math.imul(particle + 1, 0x9e3779b1) ^ words[2]) >>> 0) / 4294967296;
              const sx = frame.starts[index * 2], sy = frame.starts[index * 2 + 1], ex = frame.ends[index * 2], ey = frame.ends[index * 2 + 1];
              const angle = (((Math.imul(particle + 11, 0x85ebca6b) ^ words[1]) >>> 0) / 4294967296) * Math.PI * 2;
              const spread = 1.5 + (frame.tones[index] / 255) * 7;
              const x = (sx + (ex - sx) * amount) * 1024 + Math.cos(angle) * spread;
              const y = (sy + (ey - sy) * amount) * 1024 + Math.sin(angle) * spread;
              const radius = 2.2 + (((Math.imul(particle + 29, 0xc2b2ae35) ^ words[3]) >>> 0) / 4294967296) * 6.8;
              dustContext.moveTo(x + radius, y); dustContext.arc(x, y, radius, 0, Math.PI * 2);
            }
            dustContext.fill(); revealedDust = targetDust;
            ctx.fillStyle = house.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
            const wavePhase = ((now - cycleStartedRef.current) % waveDuration) / waveDuration * Math.PI * 2;
            const direction = words[1] % 2 ? 1 : -1;
            const motion = config.algorithm === "Crystal Growth" ? { driftX: 1.2, driftY: 1.2, rotate: .0025, scale: .004 }
              : config.algorithm === "Flow Fields" ? { driftX: 5.5, driftY: 2.2, rotate: .002, scale: .003 }
              : config.algorithm === "Fractal Roots" ? { driftX: 1.4, driftY: 3.2, rotate: .0015, scale: .005 }
              : config.algorithm === "Magnetic Nebula" ? { driftX: 2.8, driftY: 2.8, rotate: .005, scale: .006 }
              : { driftX: 1.2, driftY: 1.2, rotate: .003, scale: .004 };
            const waveScale = 1.008 + Math.sin(wavePhase) * motion.scale;
            const rotation = config.algorithm === "Sacred Geometry" ? wavePhase * .0015 * direction : Math.sin(wavePhase * .61) * motion.rotate * direction;
            formationContext.clearRect(0, 0, 1024, 1024); formationContext.globalCompositeOperation = "source-over"; formationContext.drawImage(base, 0, 0); formationContext.globalCompositeOperation = "destination-in"; formationContext.drawImage(dustMask, 0, 0); formationContext.globalCompositeOperation = "source-over";
            ctx.save(); ctx.translate(512 + Math.sin(wavePhase) * motion.driftX, 512 + Math.cos(wavePhase * .73) * motion.driftY); ctx.rotate(rotation); ctx.scale(waveScale, waveScale); ctx.drawImage(rawFormation >= 1 ? base : formationLayer, -512, -512); ctx.restore();
            const cycle = Math.min(1, elapsed / formationDuration); ctx.globalCompositeOperation = "lighter";
            for (let i = words[0] % 41; i < frame.tones.length; i += 211) {
              const phase = (cycle + ((i * 2654435761) >>> 0) / 4294967296) % 1;
              const pulse = Math.pow(Math.max(0, Math.sin(phase * Math.PI)), 12); if (pulse < .025) continue;
              const travel = .5 - .5 * Math.cos(phase * Math.PI * 2);
              const x = (frame.starts[i * 2] + (frame.ends[i * 2] - frame.starts[i * 2]) * travel) * canvas.width;
              const y = (frame.starts[i * 2 + 1] + (frame.ends[i * 2 + 1] - frame.starts[i * 2 + 1]) * travel) * canvas.height;
              ctx.globalAlpha = pulse * .62; ctx.fillStyle = i % 3 ? house.secondary : house.primary; ctx.shadowColor = house.primary; ctx.shadowBlur = canvas.width * .009;
              ctx.beginPath(); ctx.arc(x, y, canvas.width * (.0007 + pulse * .0011), 0, Math.PI * 2); ctx.fill();
            }
            ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          } else ctx.drawImage(base, 0, 0);
        };
        raf = requestAnimationFrame(draw);
      } catch { setRendering(false); setRenderError(true); }
    };

    setRendering(true);
    begin();
    return () => { active = false; cancelAnimationFrame(raf); };
  }, [words, features, onReady]);

  const toggleLiving = () => setLiving(value => { livingRef.current = !value; if (!value) cycleStartedRef.current = performance.now(); return !value; });
  return <div className="art-panel living-panel" onContextMenu={event=>event.preventDefault()}><canvas ref={canvasRef} aria-label={living ? "Your House-colour NFT forming into its complete pattern" : "Your complete still NFT"} />{rendering && <div className="rendering">RENDERING YOUR HOUSE PATTERN</div>}{renderError && <div className="rendering render-error">NFT PREVIEW UNAVAILABLE</div>}<div className="preview-quality">HOUSE PALETTE · LIVE + STILL</div><button className="living-toggle" onClick={toggleLiving} disabled={renderError}><span className={living ? "is-live" : ""} /> {living ? "LIVE NFT · FORMING" : "STILL NFT · COMPLETE"}</button></div>;
}
