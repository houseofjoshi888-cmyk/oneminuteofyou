"use client";

import { useEffect, useRef, useState } from "react";

export function HeroSound() {
  const [playing, setPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const stop = () => {
    oscillatorsRef.current.forEach(oscillator => oscillator.stop());
    oscillatorsRef.current = [];
    contextRef.current?.close(); contextRef.current = null; gainRef.current = null;
    setPlaying(false);
  };

  const toggle = async () => {
    if (playing) { stop(); return; }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    const context = new Audio(); const master = context.createGain(); master.gain.value = .0001; master.connect(context.destination);
    const frequencies = [110, 164.81, 220];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.type = index === 1 ? "sine" : "triangle"; oscillator.frequency.value = frequency;
      gain.gain.value = index === 1 ? .018 : .009; oscillator.connect(gain).connect(master); oscillator.start(); return oscillator;
    });
    master.gain.exponentialRampToValueAtTime(.18, context.currentTime + 1.4);
    contextRef.current = context; gainRef.current = master; oscillatorsRef.current = oscillators; setPlaying(true);
  };

  useEffect(() => () => { oscillatorsRef.current.forEach(oscillator => oscillator.stop()); contextRef.current?.close(); }, []);
  return <button className="sound-toggle" type="button" onClick={toggle} aria-pressed={playing} aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}><span className={playing ? "sound-wave is-playing" : "sound-wave"}><i /><i /><i /></span>{playing ? "AMBIENCE ON" : "PLAY AMBIENCE"}</button>;
}
