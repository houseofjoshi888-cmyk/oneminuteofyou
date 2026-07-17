"use client";

import { useEffect, useRef, useState } from "react";
import { drawProvenanceSeal } from "@/lib/provenance";
import type { RoyalHouse } from "@/lib/houses";

export function SeedReveal({ hash, house, onComplete }: { hash: string; house: RoyalHouse; onComplete: () => void }) {
  const seal = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [cipher, setCipher] = useState(hash.slice(0, 16));
  useEffect(() => {
    if (seal.current) drawProvenanceSeal(seal.current, hash, house.primary, house.secondary, 900);
    const alphabet = "0123456789ABCDEF";
    let tick = 0;
    const scramble = window.setInterval(() => {
      tick += 1;
      setCipher(Array.from({ length: 16 }, (_, index) => index < Math.floor(tick / 3) ? hash[index].toUpperCase() : alphabet[(tick * 7 + index * 11) % 16]).join(""));
      if (tick >= 48) window.clearInterval(scramble);
    }, 45);
    const stages = [window.setTimeout(() => setPhase(1), 650), window.setTimeout(() => setPhase(2), 1900), window.setTimeout(() => setPhase(3), 3200), window.setTimeout(onComplete, 4700)];
    return () => { window.clearInterval(scramble); stages.forEach(window.clearTimeout); };
  }, [hash, house, onComplete]);
  return <section className={`seed-reveal reveal-phase-${phase}`} style={{ "--house-primary": house.primary, "--house-secondary": house.secondary } as React.CSSProperties}>
    <div className="reveal-stars" />
    <p className="eyebrow"><span /> THE MINUTE IS COMPLETE</p>
    <div className="reveal-seal"><canvas ref={seal} /><i /></div>
    <p className="reveal-step">{phase < 1 ? "Gathering sixty seconds" : phase < 2 ? "Forging the SHA-256 seed" : phase < 3 ? "Consulting the Royal Houses" : "Provenance sealed forever"}</p>
    <code>{cipher.slice(0, 8)} · {cipher.slice(8)}</code>
    <h2>{phase < 3 ? "Your gesture becomes legend." : `${house.name} claims your minute.`}</h2>
    <button className="reveal-skip" onClick={onComplete}>Reveal now</button>
  </section>;
}
