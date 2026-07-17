"use client";
import { useEffect, useRef, useState } from "react";
import type { InteractionFeatures } from "@/lib/analyzer";
import { renderArtwork, renderConfigForHouse } from "@/lib/renderer";
import { simulateParticles } from "@/lib/simulation";

interface RendererProps { words: [number, number, number, number]; features: InteractionFeatures; onReady?: (canvas: HTMLCanvasElement) => void; }
export function Renderer({ words, features, onReady }: RendererProps) {
  const ref = useRef<HTMLCanvasElement>(null); const [rendering, setRendering] = useState(true);
  useEffect(() => { const canvas = ref.current; if (!canvas) return; setRendering(true); const id = requestAnimationFrame(() => { const frame = simulateParticles(words, features); renderArtwork(canvas, frame, { ...renderConfigForHouse(words, 1536), lineAlpha: .17, lineWidth: .38 }); setRendering(false); onReady?.(canvas); }); return () => cancelAnimationFrame(id); }, [words, features, onReady]);
  return <div className="art-panel"><canvas ref={ref} aria-label="Your generated artwork" />{rendering && <div className="rendering">RENDERING 100,000 PARTICLES</div>}</div>;
}
