"use client";
import Link from "next/link";

export function HomeExperience(){return <main className="reference-landing">
  <div className="reference-shell">
    <nav className="reference-nav">
      <Link className="reference-brand" href="/" aria-label="One Minute of You home">
        <img src="/one-minute-of-you-logo.png" alt="" />
        <span><strong>ONE MINUTE OF YOU</strong><small>THE ART OF PRESENCE. &nbsp; THE PROOF OF YOU.</small></span>
      </Link>
      <div className="reference-links"><a href="#about">ABOUT</a><Link href="/generate">HOW IT WORKS</Link><Link href="/collection">GALLERY</Link><Link href="/collection#houses">ROYAL HOUSE</Link><Link href="/legal">DOCS</Link></div>
      <Link className="reference-enter" href="/generate">ENTER APP <b>→</b></Link>
    </nav>
    <section className="reference-hero">
      <div className="reference-copy"><span>✣</span><h1>YOU ARE<br/>THE ORIGINAL<br/>ALGORITHM.</h1><hr/><p>Record one minute of movement.<br/>We transform it into generative art.<br/>You own it forever.</p><div className="reference-actions"><Link href="/generate">START YOUR MINUTE <b>→</b></Link><button onClick={()=>document.querySelector(".reference-art")?.scrollIntoView({behavior:"smooth"})}>WATCH FILM <i>▷</i></button></div></div>
      <div className="reference-art" aria-label="A dancer formed from luminous particles"><img src="/landing-dancer.png" alt="A dancer formed from gold and crimson particles" /></div>
      <small className="reference-scroll"><i/> SCROLL TO DISCOVER</small><div className="reference-count"><small>TOTAL MINUTES RECORDED</small><b>128,643</b></div>
    </section>
  </div>
 </main>}
