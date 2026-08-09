"use client";

import { useState, type CSSProperties } from "react";
import { createProvenanceCertificateBlob, exportProvenanceCertificate } from "@/lib/provenance";
import { royalHouseFromHash } from "@/lib/houses";

interface CertificateShareProps { title: string; hash: string; house?: string; primary?: string; secondary?: string; }

export function CertificateShare({ title, hash, house, primary, secondary }: CertificateShareProps) {
  const assignedHouse = royalHouseFromHash(hash);
  house ||= assignedHouse.name; primary ||= assignedHouse.primary; secondary ||= assignedHouse.secondary;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const message = `Happy news — my one-of-one artwork “${title}” has joined ${house} on One Minute of You. ✦`;
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const encodedMessage = () => encodeURIComponent(message);
  const encodedUrl = () => encodeURIComponent(shareUrl);
  const popup = (url: string) => window.open(url, "_blank", "noopener,noreferrer,width=720,height=680");
  const social = (network: "x" | "facebook" | "linkedin" | "whatsapp" | "telegram") => {
    const destinations = {
      x: `https://twitter.com/intent/tweet?text=${encodedMessage()}&url=${encodedUrl()}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl()}&quote=${encodedMessage()}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl()}`,
      whatsapp: `https://wa.me/?text=${encodedMessage()}%20${encodedUrl()}`,
      telegram: `https://t.me/share/url?url=${encodedUrl()}&text=${encodedMessage()}`,
    };
    popup(destinations[network]);
  };
  const nativeShare = async () => {
    setStatus("");
    try {
      const blob = await createProvenanceCertificateBlob(hash, title, house, primary, secondary);
      const file = blob ? new File([blob], `one-minute-of-you-${hash.slice(0, 8)}.png`, { type: "image/png" }) : null;
      const data: ShareData = { title: `${title} — One Minute of You`, text: message, url: shareUrl };
      if (file && navigator.canShare?.({ files: [file] })) data.files = [file];
      if (navigator.share) { await navigator.share(data); setStatus(file && data.files ? "CERTIFICATE SHARED" : "NEWS SHARED"); }
      else { await navigator.clipboard.writeText(`${message} ${shareUrl}`); setStatus("MESSAGE COPIED"); }
    } catch (error) { if ((error as DOMException).name !== "AbortError") setStatus("SHARING UNAVAILABLE"); }
  };
  const copy = async () => { await navigator.clipboard.writeText(`${message} ${shareUrl}`); setStatus("MESSAGE + LINK COPIED"); };
  return <div className={`certificate-share ${open ? "is-open" : ""}`}>
    <button className="certificate-share-trigger" onClick={() => setOpen(value => !value)}>SHARE THE HAPPY NEWS <span>{open ? "×" : "↗"}</span></button>
    {open && <section className="share-sheet" aria-label="Share your One Minute of You certificate">
      <div className="share-card" style={{ "--certificate-primary": primary, "--certificate-secondary": secondary } as CSSProperties}>
        <small>ONE MINUTE OF YOU · ROYAL HOUSES</small><i>◆</i><p>A NEW ONE-OF-ONE HAS ARRIVED</p><h3>{title}</h3><em>{house}</em><b>{hash.slice(0, 8).toUpperCase()}</b><span>DETERMINISTIC PROVENANCE · EDITION 1 / 1</span>
      </div>
      <p className="share-message">{message}</p>
      <div className="social-options">
        <button onClick={() => social("x")} aria-label="Share on X">X</button><button onClick={() => social("facebook")} aria-label="Share on Facebook">f</button><button onClick={() => social("linkedin")} aria-label="Share on LinkedIn">in</button><button onClick={() => social("whatsapp")} aria-label="Share on WhatsApp">WA</button><button onClick={() => social("telegram")} aria-label="Share on Telegram">TG</button>
      </div>
      <div className="share-actions"><button onClick={nativeShare}>SHARE WITH IMAGE</button><button onClick={() => exportProvenanceCertificate(hash, title, house, primary, secondary)}>DOWNLOAD IMAGE</button><button onClick={copy}>COPY NEWS + LINK</button></div>
      {status && <small className="share-status" aria-live="polite">{status}</small>}
    </section>}
  </div>;
}
