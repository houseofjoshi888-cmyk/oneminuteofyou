import Link from "next/link";
import { HeroConstellation } from "@/components/HeroConstellation";

const marks = ["MOTION", "RHYTHM", "PAUSE", "DIRECTION", "ROYAL HOUSE"];

export default function Home() {
  return (
    <main className="landing">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="nav shell" aria-label="Primary navigation">
        <Link className="brand" href="/">ONE MINUTE <i>OF</i> YOU</Link>
        <span className="nav-note">A deterministic portrait of attention</span>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> GENERATIVE STUDY Nº 01</p>
          <h1>Your movement.<br /><em>Made visible.</em></h1>
          <p className="lede">Give us sixty seconds of your attention. Every hesitation, sweep, and turn becomes a singular work of generative art—then enters one of five deterministic Royal Houses.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/generate">Begin your minute <span>↗</span></Link>
            <span className="privacy"><b>●</b> Recorded locally<br />Nothing leaves your device</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <HeroConstellation />
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit orbit-c" />
          <div className="gold-core" />
          <span className="art-label label-a">velocity / 0.842</span>
          <span className="art-label label-b">entropy / 2.716</span>
          <span className="art-label label-c">curvature / 0.338</span>
        </div>
      </section>

      <section className="process shell">
        <p className="process-title">One minute becomes one immutable fingerprint.</p>
        <div className="process-grid">
          {marks.map((mark, index) => (
            <div className="process-item" key={mark}>
              <span>0{index + 1}</span>
              <strong>{mark}</strong>
              <i />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
