"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Canvas } from "./Canvas";
import { createRecording, normalizedPoint, type InteractionPoint, type Recording } from "@/lib/recorder";
import { track } from "@/lib/telemetry";

const DURATION = 60_000;
interface RecorderProps { onComplete: (recording: Recording) => void; }

export function Recorder({ onComplete }: RecorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<InteractionPoint[]>([]);
  const startedAt = useRef(0);
  const recordingNonce = useRef("");
  const frame = useRef(0);
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const [sampleCount, setSampleCount] = useState(0);
  const [metrics, setMetrics] = useState({ coverage: 0, distance: 0, velocity: 0, turns: 0 });
  const cells = useRef(new Set<string>());
  const distance = useRef(0);
  const turns = useRef(0);
  const previousAngle = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (!active) return;
    setActive(false); cancelAnimationFrame(frame.current);
    const canvas = canvasRef.current;
    if (canvas) { track("recording_completed",{signals:points.current.length}); onComplete(createRecording(points.current, DURATION, canvas.clientWidth, canvas.clientHeight, recordingNonce.current)); }
  }, [active, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const resize = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); const width = Math.max(1, Math.floor(canvas.clientWidth * dpr)), height = Math.max(1, Math.floor(canvas.clientHeight * dpr)); if (canvas.width === width && canvas.height === height) return; canvas.width = width; canvas.height = height; const ctx = canvas.getContext("2d"); ctx?.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize(); window.visualViewport?.addEventListener("resize", resize); return () => { observer.disconnect(); window.visualViewport?.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => { if (!active) return; const tick = () => { const next = Math.max(0, DURATION - (performance.now() - startedAt.current)); setRemaining(next); if (next <= 0) finish(); else frame.current = requestAnimationFrame(tick); }; frame.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame.current); }, [active, finish]);
  useEffect(()=>{if(!active)return;const protect=(event:BeforeUnloadEvent)=>{event.preventDefault()};const resume=()=>{if(document.visibilityState==="visible"&&performance.now()-startedAt.current>=DURATION)finish()};window.addEventListener("beforeunload",protect);document.addEventListener("visibilitychange",resume);return()=>{window.removeEventListener("beforeunload",protect);document.removeEventListener("visibilitychange",resume)}},[active,finish]);

  const start = () => { track("recording_started"); points.current = []; cells.current.clear(); distance.current = 0; turns.current = 0; previousAngle.current = null; recordingNonce.current = crypto.randomUUID?.() || `${Date.now()}-${performance.now()}`; setSampleCount(0); setMetrics({ coverage:0, distance:0, velocity:0, turns:0 }); const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (canvas && ctx) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight); startedAt.current = performance.now(); setRemaining(DURATION); setActive(true); };
  const capture = (event: React.PointerEvent<HTMLCanvasElement>, kind: "move" | "down" | "up") => {
    if (!active) return; const canvas = canvasRef.current; if (!canvas) return;
    if (kind === "down") { try { canvas.setPointerCapture(event.pointerId); } catch { /* Some embedded mobile browsers do not expose pointer capture. */ } }
    const point = normalizedPoint(event.nativeEvent, canvas.getBoundingClientRect(), startedAt.current, kind); points.current.push(point); cells.current.add(`${Math.min(9,Math.floor(point.x*10))}:${Math.min(9,Math.floor(point.y*10))}`); if (points.current.length % 8 === 0 || kind !== "move") setSampleCount(points.current.length);
    if (points.current.length > 1) { const previous = points.current[points.current.length - 2], dx=point.x-previous.x, dy=point.y-previous.y, segment=Math.hypot(dx,dy), dt=Math.max(1,point.t-previous.t), angle=Math.atan2(dy,dx); distance.current+=segment; if(segment>.0005 && previousAngle.current!==null){let turn=Math.abs(angle-previousAngle.current); if(turn>Math.PI)turn=Math.PI*2-turn; if(turn>.18)turns.current++;} if(segment>.0005)previousAngle.current=angle; if(points.current.length%8===0||kind!=="move")setMetrics({coverage:cells.current.size,distance:distance.current,velocity:segment/(dt/1000),turns:turns.current}); }
    if (points.current.length > 1) { const previous = points.current[points.current.length - 2], ctx = canvas.getContext("2d"); if (ctx) { const light = 58 + point.y * 24; ctx.strokeStyle = `hsla(41,72%,${light}%,${0.24 + point.pressure * .45})`; ctx.shadowColor = "rgba(217,181,103,.8)"; ctx.shadowBlur = 9; ctx.lineWidth = 0.8 + point.pressure * 1.6; ctx.beginPath(); ctx.moveTo(previous.x * canvas.clientWidth, previous.y * canvas.clientHeight); ctx.lineTo(point.x * canvas.clientWidth, point.y * canvas.clientHeight); ctx.stroke(); ctx.shadowBlur = 0; if (kind !== "move") { ctx.fillStyle = "rgba(255,245,205,.95)"; ctx.beginPath(); ctx.arc(point.x * canvas.clientWidth, point.y * canvas.clientHeight, 2.2, 0, Math.PI * 2); ctx.fill(); } } }
  };

  const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
  const clock = `${String(Math.floor(totalSeconds / 60)).padStart(2,"0")}:${String(totalSeconds % 60).padStart(2,"0")}`;
  const elapsedPercent = Math.min(100, Math.max(0, ((DURATION - remaining) / DURATION) * 100));
  return <div className="studio-stage studio-reference-stage">
    <aside className="studio-timer">
      <small>YOU HAVE</small><strong>{clock}</strong><span>SECONDS LEFT</span>
      <em className={active ? "is-active" : ""}>{active ? "RECORDING" : "READY"}</em>
      <div className="studio-tips"><small>TIPS</small><p><b>Move naturally.</b>Let your movement flow without overthinking.</p><p><b>Fill the space.</b>Use the whole canvas with your gesture.</p><p><b>Express yourself.</b>Authenticity creates a lasting impression.</p></div>
    </aside>
    <section className="studio-capture-frame">
      <div className="generator-field" aria-hidden="true"><i/><i/><i/><i/><b>φ</b><span>X / 0—1</span><span>Y / 0—1</span></div>
      <div className={`studio-canvas-timer ${active ? "is-active" : ""}`}><small>{active ? "RECORDING" : "READY"}</small><strong>{clock}</strong></div>
      <Canvas ref={canvasRef} className="capture-canvas" aria-label="Movement recording canvas" onContextMenu={event => event.preventDefault()} onPointerMove={event => capture(event, "move")} onPointerDown={event => capture(event, "down")} onPointerUp={event => capture(event, "up")} onPointerCancel={event => capture(event, "up")} />
      <i className="frame-corner corner-a"/><i className="frame-corner corner-b"/><i className="frame-corner corner-c"/><i className="frame-corner corner-d"/>
    </section>
    <aside className="studio-controls">
      <small>LIVE MEASUREMENT</small><div className="generator-metrics"><div><span>COVERAGE</span><strong>{metrics.coverage}%</strong></div><div><span>VELOCITY</span><strong>{metrics.velocity.toFixed(2)}</strong></div><div><span>DISTANCE</span><strong>{metrics.distance.toFixed(2)}</strong></div><div><span>TURNS</span><strong>{metrics.turns}</strong></div></div>
      <small>SEED INPUT</small><div className="control-pair"><span className="selected">POINTER / TOUCH</span><span>NORMALIZED XY</span></div>
      {!active ? <button className="record-button" onClick={start}>START RECORDING</button> : <button className="record-button stop" onClick={finish}>STOP RECORDING</button>}
      <p>{sampleCount.toLocaleString()} SIGNALS<br/>CAPTURED LOCALLY</p>
    </aside>
    <div className={`studio-wave ${active ? "is-playing" : ""}`} style={{"--wave-progress":`${elapsedPercent}%`} as CSSProperties} aria-label={active ? `Recording signal, ${clock} remaining` : "Recording signal ready"}><span>{active ? `LIVE SIGNAL · ${clock}` : "SIGNAL READY · 01:00"}</span>{Array.from({length:64},(_,i)=><i key={i} style={{height:`${7 + ((i * 17) % 31)}px`,"--bar-delay":`${-(i%11)*0.07}s`} as CSSProperties}/>)}</div>
  </div>;
}
