"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { Countdown } from "./Countdown";
import { createRecording, normalizedPoint, type InteractionPoint, type Recording } from "@/lib/recorder";

const DURATION = 60_000;
interface RecorderProps { onComplete: (recording: Recording) => void; }

export function Recorder({ onComplete }: RecorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<InteractionPoint[]>([]);
  const startedAt = useRef(0);
  const frame = useRef(0);
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const [sampleCount, setSampleCount] = useState(0);

  const finish = useCallback(() => {
    if (!active) return;
    setActive(false); cancelAnimationFrame(frame.current);
    const canvas = canvasRef.current;
    if (canvas) onComplete(createRecording(points.current, DURATION, canvas.clientWidth, canvas.clientHeight));
  }, [active, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const resize = () => { const dpr = Math.min(2, devicePixelRatio || 1); canvas.width = Math.floor(canvas.clientWidth * dpr); canvas.height = Math.floor(canvas.clientHeight * dpr); const ctx = canvas.getContext("2d"); ctx?.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize); return () => removeEventListener("resize", resize);
  }, []);

  useEffect(() => { if (!active) return; const tick = () => { const next = Math.max(0, DURATION - (performance.now() - startedAt.current)); setRemaining(next); if (next <= 0) finish(); else frame.current = requestAnimationFrame(tick); }; frame.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame.current); }, [active, finish]);

  const start = () => { points.current = []; setSampleCount(0); startedAt.current = performance.now(); setRemaining(DURATION); setActive(true); };
  const capture = (event: React.PointerEvent<HTMLCanvasElement>, kind: "move" | "down" | "up") => {
    if (!active) return; const canvas = canvasRef.current; if (!canvas) return;
    if (kind === "down") canvas.setPointerCapture(event.pointerId);
    const point = normalizedPoint(event.nativeEvent, canvas.getBoundingClientRect(), startedAt.current, kind); points.current.push(point); if (points.current.length % 8 === 0 || kind !== "move") setSampleCount(points.current.length);
    if (points.current.length > 1) { const previous = points.current[points.current.length - 2], ctx = canvas.getContext("2d"); if (ctx) { const hue = 38 + point.y * 280; ctx.strokeStyle = `hsla(${hue},88%,68%,${0.24 + point.pressure * .45})`; ctx.shadowColor = `hsla(${hue},95%,66%,.85)`; ctx.shadowBlur = 9; ctx.lineWidth = 0.8 + point.pressure * 1.6; ctx.beginPath(); ctx.moveTo(previous.x * canvas.clientWidth, previous.y * canvas.clientHeight); ctx.lineTo(point.x * canvas.clientWidth, point.y * canvas.clientHeight); ctx.stroke(); ctx.shadowBlur = 0; if (kind !== "move") { ctx.fillStyle = "rgba(255,245,205,.95)"; ctx.beginPath(); ctx.arc(point.x * canvas.clientWidth, point.y * canvas.clientHeight, 2.2, 0, Math.PI * 2); ctx.fill(); } } }
  };

  return <div className="studio-stage">
    <Canvas ref={canvasRef} className="capture-canvas" aria-label="Interaction recording canvas" onPointerMove={event => capture(event, "move")} onPointerDown={event => capture(event, "down")} onPointerUp={event => capture(event, "up")} />
    <div className="studio-overlay">
      {!active && <div className="studio-intro"><p className="eyebrow"><span /> YOUR CANVAS IS READY</p><h2>Move as you think.</h2><p>Draw, hover, pause, tap. There is no right gesture.</p></div>}
      <Countdown remainingMs={remaining} active={active} />
      {!active && <button className="record-button" onClick={start}>Start 60-second recording</button>}
      <div className="capture-bottom"><span className="capture-hint"><b>Move anywhere</b><br />mouse · touch · pen</span><span className="live-samples">{sampleCount.toLocaleString()} signals<br />captured locally</span></div>
    </div>
  </div>;
}
