"use client";

import { useEffect, useRef } from "react";
import type { InteractionFeatures } from "@/lib/analyzer";
import { drawMathematicalHousePattern, renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { compositionFor, isSurfaceComposition, PREVIEW_SIMULATION, SURFACE_SIMULATION, simulateParticles } from "@/lib/simulation";
import { royalHouseFromWords } from "@/lib/houses";

export function LivingRenderer({ words, features, onReady }: { words: [number, number, number, number]; features: InteractionFeatures; onReady?: (canvas: HTMLCanvasElement) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const frame = simulateParticles(words, features, isSurfaceComposition(compositionFor(words, features)) ? SURFACE_SIMULATION : PREVIEW_SIMULATION);
      const house = royalHouseFromWords(words);
      const config = { ...renderConfigForHouse(words, 1024), lineAlpha: .34, lineWidth: .82 };
      const generated = document.createElement("canvas");
      renderArtwork(generated, frame, config);

      canvas.width = 1024;
      canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.fillStyle = house.background;
      context.fillRect(0, 0, 1024, 1024);
      drawMathematicalHousePattern(context, frame, config);
      context.save();
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = .72;
      context.drawImage(generated, 0, 0);
      context.restore();
      onReady?.(canvas);
    } catch {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#030303";
        context.fillRect(0, 0, canvas.width || 1024, canvas.height || 1024);
      }
    }
  }, [words, features, onReady]);

  return <div className="art-panel living-panel" onContextMenu={event => event.preventDefault()}>
    <canvas ref={canvasRef} aria-label="Your complete House-colour NFT" />
    <div className="preview-quality">HOUSE PALETTE · COMPLETE NFT</div>
  </div>;
}
