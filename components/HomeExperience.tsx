"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { HeroConstellation, type ObservatoryPhase } from "@/components/HeroConstellation";
import { HeroSound } from "@/components/HeroSound";

const phases: { id: ObservatoryPhase; number: string; title: string; detail: string; metric: string }[] = [
  { id: "enter", number: "01", title: "Enter the field", detail: "A living field waits for one quiet minute of your attention.", metric: "FIELD / AWAKE" },
  { id: "move", number: "02", title: "Move naturally", detail: "Your pointer, touch, rhythm, and pauses become a private motion trace.", metric: "MOTION / CAPTURE" },
  { id: "measure", number: "03", title: "Let mathematics listen", detail: "Entropy, curvature, velocity, and symmetry become a reproducible SHA-256 seed.", metric: "SEED / FORGING" },
  { id: "reveal", number: "04", title: "Reveal your artwork", detail: "That seed resolves into a one-of-one portrait and its Royal House identity.", metric: "ARTWORK / SEALED" },
];

export function HomeExperience() {
  const [phase, setPhase] = useState<ObservatoryPhase>("enter");
  const active = phases.find((item) => item.id === phase) ?? phases[0];
  const nextPhase = () => setPhase(phases[Math.min(phases.length - 1, phases.findIndex((item) => item.id === phase) + 1)].id);

  return <main className={`landing observatory phase-${phase}`}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <nav className="nav shell" aria-label="Primary navigation"><Brand /><span className="nav-note">A deterministic portrait of attention</span></nav>
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span /> ONE MINUTE OF YOU</p>
        <h1>{phase === "reveal" ? <>Your minute.<br /><em>Made eternal.</em></> : <>Your movement.<br /><em>Made visible.</em></>}</h1>
        <p className="lede">Give this field one minute of your movement. Science and mathematics turn it into a personal, reproducible work of generative art.</p>
        <div className="hero-actions"><Link className="primary-button" href="/generate">Begin your minute <span>↗</span></Link><span className="privacy"><b>●</b> Recorded locally<br />Nothing leaves your device</span></div>
      </div>
      <div className="hero-art" aria-label={`Interactive 3D field: ${active.title}`}>
        <HeroConstellation phase={phase} />
        <div className="orbit orbit-a" aria-hidden="true" /><div className="orbit orbit-b" aria-hidden="true" /><div className="orbit orbit-c" aria-hidden="true" /><div className="gold-core" aria-hidden="true" />
        <span className="art-label label-a">{phase === "move" ? "trace / live" : "velocity / 0.842"}</span><span className="art-label label-b">{phase === "measure" ? "entropy / resolved" : "entropy / 2.716"}</span><span className="art-label label-c">{phase === "reveal" ? "seed / sealed" : "curvature / 0.338"}</span>
        <div className="hero-seal" aria-hidden="true"><span>{phase === "reveal" ? "1/1" : "1"}</span><i>{phase === "reveal" ? "SEALED" : "MINUTE"}</i><b>{phase === "measure" ? "∑" : "∞"}</b></div><HeroSound />
      </div>
    </section>
    <section className="observatory-ritual shell" aria-labelledby="ritual-title">
      <div className="ritual-intro"><p className="eyebrow"><span /> HOW IT WORKS</p><h2 id="ritual-title">Scroll the story.<br /><em>Make it yours.</em></h2><p>Explore the four short stages below. The 3D field changes with each one.</p></div>
      <div className="ritual-controls" role="tablist" aria-label="Artwork creation stages">{phases.map((item) => <button key={item.id} role="tab" aria-selected={phase === item.id} className={phase === item.id ? "is-active" : ""} onClick={() => setPhase(item.id)}><span>{item.number}</span><strong>{item.title}</strong><i>{item.metric}</i></button>)}</div>
      <div className="ritual-reading"><span>{active.number} / 04</span><h3>{active.title}</h3><p>{active.detail}</p>{phase === "reveal" ? <Link href="/generate" className="text-link">Create your artwork <b>↗</b></Link> : <button className="text-link" onClick={nextPhase}>Continue <b>→</b></button>}</div>
    </section>
    <section className="process shell" aria-label="The One Minute process"><p className="process-title">ONE MINUTE. ONE SEED. ONE UNIQUE WORK.</p><div className="process-grid">{phases.map((item) => <div className="process-item" key={item.id}><span>{item.number}</span><strong>{item.title.toUpperCase()}</strong><i /></div>)}</div></section>
  </main>;
}
