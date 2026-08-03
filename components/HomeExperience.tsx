"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/Brand";

const houses = [
  ["RUBY", "PASSION", "#b1122d"], ["SAPPHIRE", "TRUST", "#1746a0"],
  ["EMERALD", "GROWTH", "#087a5b"], ["AMETHYST", "WISDOM", "#7133a2"],
] as const;

const steps = [
  ["01", "RECORD", "Move naturally for sixty seconds. Your gesture stays private on this device."],
  ["02", "GENERATE", "Rhythm, velocity and stillness resolve into a deterministic visual signature."],
  ["03", "REVEAL", "Receive a singular artwork, its provenance, and your place in a Royal House."],
] as const;

export function HomeExperience() {
  const [active, setActive] = useState(0);

  return <main className="royal-home">
    <header className="royal-mast shell">
      <Brand />
      <div className="royal-direction"><b>DIRECTION 01&nbsp;&nbsp;·&nbsp;&nbsp; ROYAL EDITORIAL</b><span>A one-minute movement becomes generative art and on-chain provenance.</span></div>
      <div className="royal-houses" aria-label="Royal Houses">{houses.map(([name, trait, color]) => <div key={name}><i style={{"--jewel": color} as React.CSSProperties} /><span><b>{name}</b><small>{trait}</small></span></div>)}</div>
    </header>

    <section className="royal-frame shell">
      <nav className="royal-nav" aria-label="Primary navigation">
        <Brand />
        <div><a href="#about">ABOUT</a><a href="#ritual">HOW IT WORKS</a><Link href="/collection">GALLERY</Link><a href="#houses">ROYAL HOUSES</a></div>
        <Link className="outline-action" href="/generate">ENTER APP <b>→</b></Link>
      </nav>
      <div className="royal-hero">
        <div className="royal-copy">
          <span className="royal-sigil">✣</span>
          <h1>YOU ARE<br />THE ORIGINAL<br />ALGORITHM.</h1>
          <div className="gold-rule" />
          <p>Record one minute of movement.<br />We transform it into generative art.<br />You own it forever.</p>
          <div className="royal-actions"><Link href="/generate">START YOUR MINUTE <b>→</b></Link><button onClick={() => document.getElementById("ritual")?.scrollIntoView({behavior:"smooth"})}>WATCH FILM <i>▷</i></button></div>
        </div>
        <div className="royal-art" role="img" aria-label="Golden generative movement artwork" />
        <span className="scroll-note">↓&nbsp;&nbsp; SCROLL TO DISCOVER</span>
        <div className="minute-count"><small>TOTAL MINUTES RECORDED</small><strong>128,643</strong></div>
      </div>
    </section>

    <section className="royal-story shell" id="about">
      <aside><span>02</span><b>THE ART OF<br />PRESENCE</b></aside>
      <div><p className="section-kicker">ONE MINUTE. ONE SEED. ONE UNIQUE WORK.</p><h2>A portrait made<br />from <em>presence.</em></h2></div>
      <p className="story-copy">No prompt. No preset. Your movement is the medium—translated into a reproducible visual language of gesture, rhythm and pause.</p>
    </section>

    <section className="royal-ritual shell" id="ritual">
      <div className="ritual-head"><p className="section-kicker">THE CEREMONY</p><h2>How your minute<br />becomes <em>eternal.</em></h2></div>
      <div className="ritual-list">{steps.map(([number,title,copy], index) => <button key={title} className={active === index ? "active" : ""} onClick={() => setActive(index)}><span>{number}</span><strong>{title}</strong><p>{copy}</p><i>↗</i></button>)}</div>
      <div className="ritual-preview"><span>{steps[active][0]} / 03</span><b>{steps[active][1]}</b><p>{steps[active][2]}</p><Link href="/generate">BEGIN THE CEREMONY&nbsp;&nbsp; →</Link></div>
    </section>

    <section className="house-section shell" id="houses">
      <div><p className="section-kicker">THE ROYAL HOUSES</p><h2>Every movement<br />finds its house.</h2></div>
      <div className="house-grid">{houses.map(([name,trait,color], index) => <article key={name} style={{"--jewel":color} as React.CSSProperties}><small>HOUSE 0{index + 1}</small><i /><h3>{name}</h3><p>{trait}</p><Link href="/collection">DISCOVER HOUSE →</Link></article>)}</div>
    </section>

    <footer className="royal-foot shell"><b>ONE MINUTE OF YOU</b><span>A WEB3 GENERATIVE ART PLATFORM</span><span>DESIGN DIRECTION 01 · ROYAL EDITORIAL</span></footer>
  </main>;
}
