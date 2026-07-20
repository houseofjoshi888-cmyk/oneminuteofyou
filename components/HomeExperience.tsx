"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { HeroConstellation, type ObservatoryPhase } from "@/components/HeroConstellation";
import { HeroSound } from "@/components/HeroSound";

const phases: { id: ObservatoryPhase; number: string; title: string; detail: string; metric: string }[] = [
  { id: "enter", number: "01", title: "Enter the observatory", detail: "A living field waits for a single minute of your attention.", metric: "FIELD / AWAKE" },
  { id: "move", number: "02", title: "Move without instruction", detail: "Your pointer, touch, rhythm, and pauses form a private kinematic trace.", metric: "MOTION / CAPTURE" },
  { id: "measure", number: "03", title: "Let mathematics listen", detail: "Entropy, curvature, velocity, and symmetry become a canonical SHA-256 seed.", metric: "SEED / FORGING" },
  { id: "reveal", number: "04", title: "Reveal your royal artwork", detail: "The same seed always regenerates the same 1-of-1 portrait and House identity.", metric: "ARTWORK / SEALED" },
];

export function HomeExperience() {
  const [phase, setPhase] = useState<ObservatoryPhase>("enter");
  const active = phases.find(item => item.id === phase) || phases[0];
  return <main className={`landing observatory phase-${phase}`}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <nav className="nav shell" aria-label="Primary navigation"><Brand /><span className="nav-note">A deterministic portrait of attention</span></nav>
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span /> ROYAL SCIENTIFIC OBSERVATORY</p>
        <h1>{phase === "reveal" ? <>Your minute.<br /><em>Made eternal.</em></> : <>Your movement.<br /><em>Made visible.</em></>}</h1>
        <p className="lede">Enter a living 3D field, give it one minute of your movement, then watch kinematics and mathematics resolve into a one-of-one work of generative art for the five Royal Houses.</p>
        <div className="hero-actions"><Link className="primary-button" href="/generate">Begin your minute <span>↗</span></Link><span className="privacy"><b>●</b> Recorded locally<br />Nothing leaves your device</span></div>
      </div>
      <div className="hero-art" aria-label={`3D observatory: ${active.title}`}>
        <HeroConstellation phase={phase} />
        <div className="orbit orbit-a" aria-hidden="true" /><div className="orbit orbit-b" aria-hidden="true" /><div className="orbit orbit-c" aria-hidden="true" /><div className="gold-core" aria-hidden="true" />
        <span className="art-label label-a">{phase === "move" ? "trace / live" : "velocity / 0.842"}</span><span className="art-label label-b">{phase === "measure" ? "entropy / resolved" : "entropy / 2.716"}</span><span className="art-label label-c">{phase === "reveal" ? "seed / sealed" : "curvature / 0.338"}</span>
        <div className="hero-seal" aria-hidden="true"><span>{phase === "reveal" ? "1/1" : "1"}</span><i>{phase === "reveal" ? "SEALED" : "MINUTE"}</i><b>{phase === "measure" ? "∑" : "∞"}</b></div><HeroSound />
      </div>
    </section>
    <section className="observatory-ritual shell" aria-labelledby="ritual-title">
      <div className="ritual-intro"><p className="eyebrow"><span /> HOW THE ARTWORK FORMS</p><h2 id="ritual-title">A one-minute ritual.<br /><em>A permanent equation.</em></h2><p>Explore each stage. The field above transforms as the collection’s real rendering pipeline does.</p></div>
      <div className="ritual-controls" role="tablist" aria-label="Artwork formation stages">{phases.map(item => <button key={item.id} role="tab" aria-selected={phase === item.id} className={phase === item.id ? "is-active" : ""} onClick={() => setPhase(item.id)}><span>{item.number}</span><strong>{item.title}</strong><i>{item.metric}</i></button>)}</div>
      <div className="ritual-reading"><span>{active.number} / 04</span><h3>{active.title}</h3><p>{active.detail}</p>{phase === "reveal" ? <Link href="/generate" className="text-link">Create your artwork <b>↗</b></Link> : <button className="text-link" onClick={() => setPhase(phases[Math.min(phases.length - 1, phases.findIndex(item => item.id === phase) + 1)].id)}>Continue the ritual <b>→</b></button>}</div>
    </section>
  </main>;
}
