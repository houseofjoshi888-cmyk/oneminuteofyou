"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/Brand";

export function HomeExperience() {
  const [intention, setIntention] = useState("");
  const router = useRouter();
  const begin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (intention.trim()) sessionStorage.setItem("one-minute-intention", intention.trim().slice(0, 140));
    router.push("/generate");
  };
  return <main className="oracle-home">
    <header className="oracle-nav"><Brand /><nav aria-label="Homepage"><a href="#how-it-works">HOW IT WORKS</a><a href="#royal-houses">ROYAL HOUSES</a></nav><span className="oracle-mark">✦</span></header>
    <section className="oracle-stage" aria-labelledby="oracle-title">
      <div className="oracle-glow glow-ruby" /><div className="oracle-glow glow-sapphire" /><div className="oracle-grain" />
      <div className="oracle-content">
        <p className="oracle-kicker">ONE MINUTE OF YOU · GENERATIVE STUDY Nº 01</p>
        <h1 id="oracle-title">What will your movement<br />reveal?<small>Made visible.</small></h1>
        <form onSubmit={begin} className="oracle-form"><label htmlFor="intention">Begin with an intention, a question, or nothing at all.</label><input id="intention" value={intention} onChange={event => setIntention(event.target.value)} maxLength={140} autoComplete="off" placeholder="" aria-describedby="oracle-help" /><button type="submit">BEGIN YOUR MINUTE <span>↗</span></button></form>
        <p id="oracle-help" className="oracle-help">Move for sixty seconds. Your touch, rhythm, pauses, and direction become a private mathematical seed—then a singular work of art.</p>
      </div>
    </section>
    <footer className="oracle-footer"><span>01 / MOTION BECOMES MATTER</span><span id="how-it-works">KINEMATICS · ENTROPY · GEOMETRY · SHA-256</span><Link id="royal-houses" href="/generate">FIVE ROYAL HOUSES</Link></footer>
  </main>;
}
