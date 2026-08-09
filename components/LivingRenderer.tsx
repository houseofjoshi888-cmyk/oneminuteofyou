"use client";

import { useEffect, useRef, useState } from "react";
import type { InteractionFeatures } from "@/lib/analyzer";
import { renderArtwork, renderConfigForHouse } from "@/lib/renderer";
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
    let raf = 0; let active = true; let lastFrame = -Infinity; let reportedReady = false;
    const initialize = () => {
      if (!active) return;
      const base = document.createElement("canvas");
      try {
        setRenderError(false);
        const frame = simulateParticles(words, features, isSurfaceComposition(compositionFor(words, features)) ? SURFACE_SIMULATION : PREVIEW_SIMULATION);
        renderArtwork(base, frame, { ...renderConfigForHouse(words, 1024), lineAlpha: .18, lineWidth: .68 });
        canvas.width = base.width; canvas.height = base.height;
        const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas unavailable");
        const house = royalHouseFromWords(words); const duration = 12_000; const drawDuration = 10_000;
        cycleStartedRef.current = performance.now();
        const draw = (now: number) => {
          if (!active) return;
          raf = requestAnimationFrame(draw);
          if (now - lastFrame < 33) return;
          lastFrame = now;
          ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
          if (livingRef.current) {
            const elapsed = (now - cycleStartedRef.current) % duration;
            const progress = Math.min(1, elapsed / drawDuration);
            const eased = 1 - Math.pow(1 - progress, 3);
            ctx.fillStyle = house.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.save(); ctx.globalAlpha = .2; ctx.drawImage(base, 0, 0); ctx.restore();
            ctx.save(); ctx.beginPath(); ctx.rect(0, 0, canvas.width * eased, canvas.height); ctx.clip(); ctx.drawImage(base, 0, 0); ctx.restore();
            const cycle = elapsed / duration; ctx.globalCompositeOperation = "lighter";
            for (let i = words[0] % 41; i < frame.tones.length; i += 211) {
              const phase = (cycle + ((i * 2654435761) >>> 0) / 4294967296) % 1;
              const pulse = Math.pow(Math.max(0, Math.sin(phase * Math.PI)), 12); if (pulse < .025) continue;
              const travel = .5 - .5 * Math.cos(phase * Math.PI * 2);
              const x = (frame.starts[i * 2] + (frame.ends[i * 2] - frame.starts[i * 2]) * travel) * canvas.width;
              const y = (frame.starts[i * 2 + 1] + (frame.ends[i * 2 + 1] - frame.starts[i * 2 + 1]) * travel) * canvas.height;
              ctx.globalAlpha = pulse * .9; ctx.fillStyle = i % 3 ? house.secondary : "#ffffff"; ctx.shadowColor = house.primary; ctx.shadowBlur = canvas.width * .012;
              ctx.beginPath(); ctx.arc(x, y, canvas.width * (.0007 + pulse * .0011), 0, Math.PI * 2); ctx.fill();
            }
            ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          } else ctx.drawImage(base, 0, 0);
          if (!reportedReady) { reportedReady = true; setRendering(false); onReady?.(canvas); }
        };
        raf = requestAnimationFrame(draw);
      } catch { setRendering(false); setRenderError(true); }
    };
    raf = requestAnimationFrame(initialize);
    return () => { active = false; cancelAnimationFrame(raf); };
  }, [words, features, onReady]);
  const toggleLiving = () => setLiving(value => { livingRef.current = !value; if (!value) cycleStartedRef.current = performance.now(); return !value; });
  return <div className="art-panel living-panel" onContextMenu={event=>event.preventDefault()}><canvas ref={canvasRef} aria-label={living ? "Your live NFT drawing itself" : "Your complete still NFT"} />{rendering && <div className="rendering">RENDERING YOUR NFT</div>}{renderError && <div className="rendering render-error">NFT PREVIEW UNAVAILABLE</div>}<div className="preview-quality">ONE NFT · LIVE + STILL</div><button className="living-toggle" onClick={toggleLiving} disabled={renderError}><span className={living ? "is-live" : ""} /> {living ? "LIVE NFT · DRAWING" : "STILL NFT · COMPLETE"}</button></div>;
}
