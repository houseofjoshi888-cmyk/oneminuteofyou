"use client";

import { useState } from "react";

export function CertificateShare({ title, hash }: { title: string; hash: string }) {
  const [status, setStatus] = useState("");
  const share = async () => {
    const data = { title: `${title} — One Minute of You`, text: `A deterministic Royal House artwork · ${hash.slice(0, 8).toUpperCase()}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(window.location.href); setStatus("LINK COPIED"); }
    } catch (error) { if ((error as DOMException).name !== "AbortError") setStatus("SHARING UNAVAILABLE"); }
  };
  return <div className="certificate-share"><button onClick={share}>SHARE CERTIFICATE <span>↗</span></button>{status && <small aria-live="polite">{status}</small>}</div>;
}
