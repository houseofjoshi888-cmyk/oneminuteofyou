"use client";

import { useEffect, useRef, useState } from "react";

type SoundDetail = { type: "start" | "finish" | "draw" | "draw-stop"; x?: number; y?: number; pressure?: number };

export function SoundEffects() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const drawRef = useRef<{ oscillator: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("omoy-sound-muted") === "true";
    mutedRef.current = saved; const syncSavedState = window.setTimeout(() => setMuted(saved), 0);
    const ensure = () => {
      if (mutedRef.current) return null;
      if (!contextRef.current) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return null;
        const context = new Audio(); const master = context.createGain();
        master.gain.value = .28; master.connect(context.destination);
        contextRef.current = context; masterRef.current = master;
      }
      if (contextRef.current.state === "suspended") void contextRef.current.resume();
      return contextRef.current;
    };
    const tone = (frequency: number, duration = .09, volume = .035, type: OscillatorType = "sine") => {
      const context = ensure(), master = masterRef.current; if (!context || !master) return;
      const oscillator = context.createOscillator(), gain = context.createGain();
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(60, frequency * .72), context.currentTime + duration);
      gain.gain.setValueAtTime(.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + .012); gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
      oscillator.connect(gain).connect(master); oscillator.start(); oscillator.stop(context.currentTime + duration + .02);
    };
    const stopDraw = () => {
      const context = contextRef.current, draw = drawRef.current; if (!context || !draw) return;
      draw.gain.gain.cancelScheduledValues(context.currentTime); draw.gain.gain.setTargetAtTime(.0001, context.currentTime, .035); draw.oscillator.stop(context.currentTime + .18); drawRef.current = null;
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button,a,[role='button']") && !target.closest("[data-sound-toggle]")) tone(520, .075, .026, "triangle");
    };
    const onSound = (event: Event) => {
      const detail = (event as CustomEvent<SoundDetail>).detail;
      if (detail.type === "start") { tone(220, .22, .045, "triangle"); window.setTimeout(() => tone(330, .2, .035), 85); }
      if (detail.type === "finish") { stopDraw(); tone(392, .35, .05, "triangle"); window.setTimeout(() => tone(523.25, .42, .04), 120); }
      if (detail.type === "draw-stop") stopDraw();
      if (detail.type === "draw") {
        const context = ensure(), master = masterRef.current; if (!context || !master) return;
        if (!drawRef.current) { const oscillator = context.createOscillator(), gain = context.createGain(); oscillator.type = "sine"; gain.gain.value = .0001; oscillator.connect(gain).connect(master); oscillator.start(); drawRef.current = { oscillator, gain }; }
        const draw = drawRef.current; draw.oscillator.frequency.setTargetAtTime(105 + (1 - (detail.y ?? .5)) * 210, context.currentTime, .035); draw.gain.gain.setTargetAtTime(.01 + (detail.pressure ?? .35) * .018, context.currentTime, .045);
      }
    };
    document.addEventListener("pointerdown", onPointer, true); window.addEventListener("omoy:sound", onSound);
    return () => { window.clearTimeout(syncSavedState); document.removeEventListener("pointerdown", onPointer, true); window.removeEventListener("omoy:sound", onSound); stopDraw(); void contextRef.current?.close(); };
  }, []);

  const toggle = () => { const next = !mutedRef.current; mutedRef.current = next; setMuted(next); localStorage.setItem("omoy-sound-muted", String(next)); if (next) { masterRef.current?.gain.setTargetAtTime(.0001, contextRef.current?.currentTime ?? 0, .03); } else if (masterRef.current && contextRef.current) masterRef.current.gain.setTargetAtTime(.28, contextRef.current.currentTime, .04); };
  return <button className="effects-toggle" data-sound-toggle type="button" onClick={toggle} aria-pressed={!muted} aria-label={muted ? "Enable interaction sounds" : "Mute interaction sounds"}><span>{muted ? "×" : "∿"}</span>{muted ? "SOUND OFF" : "SOUND ON"}</button>;
}
