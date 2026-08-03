"use client";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { HeroConstellation } from "@/components/HeroConstellation";

export function HomeExperience(){return <main className="reference-landing">
  <div className="reference-shell">
    <nav className="reference-nav"><Brand/><div><a href="#about">ABOUT</a><Link href="/generate">HOW IT WORKS</Link><Link href="/collection">GALLERY</Link><Link href="/collection#houses">ROYAL HOUSE</Link><Link href="/legal">DOCS</Link></div><Link className="reference-enter" href="/generate">ENTER APP <b>→</b></Link></nav>
    <section className="reference-hero">
      <div className="reference-copy"><span>✣</span><h1>YOU ARE<br/>THE ORIGINAL<br/>ALGORITHM.</h1><hr/><p>Record one minute of movement.<br/>We transform it into generative art.<br/>You own it forever.</p><div className="reference-actions"><Link href="/generate">START YOUR MINUTE <b>→</b></Link><button onClick={()=>document.querySelector(".reference-art")?.scrollIntoView({behavior:"smooth"})}>WATCH FILM <i>▷</i></button></div></div>
      <div className="reference-art" aria-label="Generative movement artwork"><HeroConstellation phase="reveal"/><i className="ref-ring ring-a"/><i className="ref-ring ring-b"/><i className="ref-ring ring-c"/></div>
      <small className="reference-scroll">↓ &nbsp;&nbsp; SCROLL TO DISCOVER</small><div className="reference-count"><small>TOTAL MINUTES RECORDED</small><b>128,643</b></div>
    </section>
  </div>
  <footer className="reference-footer"><b>ONE MINUTE OF YOU</b><span>A WEB3 GENERATIVE ART PLATFORM</span><span>DESIGN DIRECTION 01 · ROYAL EDITORIAL</span></footer>
 </main>}
