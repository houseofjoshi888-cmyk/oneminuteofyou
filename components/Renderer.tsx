"use client";
import { useEffect, useRef, useState } from "react";
import type { InteractionFeatures } from "@/lib/analyzer";
import { renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { COMPOSITIONS, isSurfaceComposition, PREVIEW_SIMULATION, SURFACE_SIMULATION, simulateParticles } from "@/lib/simulation";

interface RendererProps { words: [number, number, number, number]; features: InteractionFeatures; onReady?: (canvas: HTMLCanvasElement) => void; }
export function Renderer({ words, features, onReady }: RendererProps) {
  const ref = useRef<HTMLCanvasElement>(null); const [rendering, setRendering] = useState(true);
  useEffect(() => { const canvas = ref.current; if (!canvas) return; setRendering(true); const id = requestAnimationFrame(() => { const composition = words[0] % COMPOSITIONS.length; const frame = simulateParticles(words, features, isSurfaceComposition(composition) ? SURFACE_SIMULATION : PREVIEW_SIMULATION); renderArtwork(canvas, frame, { ...renderConfigForHouse(words, 1024), lineAlpha: .24, lineWidth: .55 }); setRendering(false); onReady?.(canvas); }); return () => cancelAnimationFrame(id); }, [words, features, onReady]);
  return <div className="art-panel"><canvas ref={ref} aria-label="Your generated artwork" />{rendering && <div className="rendering">PREPARING FAST PREVIEW</div>}</div>;
}
