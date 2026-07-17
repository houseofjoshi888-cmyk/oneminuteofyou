"use client";

import { useEffect, useRef } from "react";

export function HeroConstellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = Array.from({ length: 460 }, (_, i) => ({
      angle: (i * 2.399963229728653) % (Math.PI * 2),
      radius: .07 + ((i * 73) % 389) / 389 * .4,
      speed: .04 + (i % 17) * .004,
      tone: i % 5,
      size: .35 + (i % 11) * .08,
    }));
    let pointerX = .5, pointerY = .5, raf = 0;
    const resize = () => { const box = canvas.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = Math.max(1, box.width * dpr); canvas.height = Math.max(1, box.height * dpr); };
    const move = (event: PointerEvent) => { const box = canvas.getBoundingClientRect(); pointerX = (event.clientX - box.left) / box.width; pointerY = (event.clientY - box.top) / box.height; };
    const palette = ["#ffe6a0", "#ff6eb7", "#9a7dff", "#55ded8", "#ffffff"];
    const draw = (ms: number) => {
      const time = reduce ? 0 : ms / 1000; const w = canvas.width, h = canvas.height, scale = Math.min(w, h);
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = "lighter";
      const cx = w * (.5 + (pointerX - .5) * .035), cy = h * (.5 + (pointerY - .5) * .035);
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        for (let i = layer; i < points.length; i += 3) {
          const point = points[i]; const angle = point.angle + time * point.speed * (layer % 2 ? -1 : 1);
          const wave = Math.sin(angle * (3 + layer) + time * .35) * .04;
          const radius = (point.radius + wave) * scale;
          const x = cx + Math.cos(angle) * radius; const y = cy + Math.sin(angle) * radius * (.54 + layer * .04);
          const tail = .018 * scale; ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(angle) * tail, y + Math.cos(angle) * tail * .5);
        }
        ctx.strokeStyle = palette[(layer + 1) % palette.length]; ctx.globalAlpha = .15 + layer * .06; ctx.lineWidth = Math.max(1, scale * .0011); ctx.shadowColor = palette[layer]; ctx.shadowBlur = scale * .018; ctx.stroke();
      }
      for (let i = 0; i < points.length; i += 5) {
        const point = points[i], angle = point.angle + time * point.speed; const pulse = .5 + .5 * Math.sin(time * 1.4 + i);
        const radius = (point.radius + Math.sin(angle * 4 + time * .3) * .035) * scale;
        const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius * .56;
        ctx.globalAlpha = .25 + pulse * .7; ctx.fillStyle = palette[point.tone]; ctx.shadowColor = palette[point.tone]; ctx.shadowBlur = scale * .012;
        ctx.beginPath(); ctx.arc(x, y, point.size * scale * .0015, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0; raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); canvas.addEventListener("pointermove", move); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="hero-constellation" />;
}
