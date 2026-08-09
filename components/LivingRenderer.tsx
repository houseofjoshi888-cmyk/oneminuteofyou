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
    let raf = 0, active = true, lastFrame = -Infinity, reportedReady = false;
    const frame = simulateParticles(words, features, isSurfaceComposition(compositionFor(words, features)) ? SURFACE_SIMULATION : PREVIEW_SIMULATION);
    const house = royalHouseFromWords(words);
    const generated = document.createElement("canvas");
    const base = document.createElement("canvas");

    const begin = (foundation?: HTMLImageElement) => {
      if (!active) return;
      try {
        renderArtwork(generated, frame, { ...renderConfigForHouse(words, 1024), lineAlpha: .78, lineWidth: 1.45 });
        base.width = 1024; base.height = 1024;
        const baseContext = base.getContext("2d"); if (!baseContext) throw new Error("Canvas unavailable");
        baseContext.fillStyle = house.background; baseContext.fillRect(0, 0, 1024, 1024);
        if (foundation) {
          const slices = 6 + ((words[0] >>> 0) % 5) * 2;
          const scale = 1.12 + ((words[1] >>> 0) % 19) / 100;
          const turn = ((words[2] >>> 0) / 4294967296) * Math.PI * 2;
          const shiftX = (((words[0] >>> 8) % 121) - 60) * 1.6;
          const shiftY = (((words[1] >>> 10) % 121) - 60) * 1.6;
          baseContext.save();
          baseContext.globalCompositeOperation = "screen";
          baseContext.globalAlpha = .72;
          for (let slice = 0; slice < slices; slice++) {
            const start = turn + slice * Math.PI * 2 / slices;
            const end = start + Math.PI * 2 / slices + .012;
            baseContext.save();
            baseContext.beginPath(); baseContext.moveTo(512, 512); baseContext.arc(512, 512, 725, start, end); baseContext.closePath(); baseContext.clip();
            baseContext.translate(512, 512); baseContext.rotate(start + (slice % 2 ? Math.PI : 0)); baseContext.scale(slice % 2 ? -scale : scale, scale);
            baseContext.drawImage(foundation, -512 + shiftX, -512 + shiftY, 1024, 1024);
            baseContext.restore();
          }
          baseContext.restore();
        }
        baseContext.save(); baseContext.globalCompositeOperation = "screen"; baseContext.globalAlpha = 1; baseContext.drawImage(generated, 0, 0); baseContext.restore();

        canvas.width = 1024; canvas.height = 1024;
        const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas unavailable");
        const duration = 12_000; cycleStartedRef.current = performance.now(); setRenderError(false);
        const draw = (now: number) => {
          if (!active) return; raf = requestAnimationFrame(draw); if (now - lastFrame < 33) return; lastFrame = now;
          ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
          if (livingRef.current) {
            const elapsed = (now - cycleStartedRef.current) % duration;
            ctx.fillStyle = house.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(base, 0, 0);
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

    setRendering(true);
    const foundation = new Image();
    foundation.onload = () => begin(foundation);
    foundation.onerror = () => begin();
    foundation.src = `/houses/${house.id}-royal-editorial.png`;
    return () => { active = false; foundation.onload = null; foundation.onerror = null; cancelAnimationFrame(raf); };
  }, [words, features, onReady]);

  const toggleLiving = () => setLiving(value => { livingRef.current = !value; if (!value) cycleStartedRef.current = performance.now(); return !value; });
  return <div className="art-panel living-panel" onContextMenu={event=>event.preventDefault()}><canvas ref={canvasRef} aria-label={living ? "Your live NFT drawing itself" : "Your complete still NFT"} />{rendering && <div className="rendering">RENDERING YOUR NFT</div>}{renderError && <div className="rendering render-error">NFT PREVIEW UNAVAILABLE</div>}<div className="preview-quality">ONE NFT · LIVE + STILL</div><button className="living-toggle" onClick={toggleLiving} disabled={renderError}><span className={living ? "is-live" : ""} /> {living ? "LIVE NFT · DRAWING" : "STILL NFT · COMPLETE"}</button></div>;
}
