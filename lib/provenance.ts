export function drawProvenanceSeal(canvas: HTMLCanvasElement, hash: string, primary: string, secondary: string, size = 720) {
  canvas.width = size; canvas.height = size; const ctx = canvas.getContext("2d"); if (!ctx) return;
  const bytes = Array.from({ length: 32 }, (_, index) => Number.parseInt(hash.slice(index * 2, index * 2 + 2), 16)); const center = size / 2;
  ctx.clearRect(0, 0, size, size); ctx.translate(center, center); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
  const glow = ctx.createRadialGradient(0, 0, size * .05, 0, 0, size * .46); glow.addColorStop(0, `${primary}55`); glow.addColorStop(.55, `${secondary}18`); glow.addColorStop(1, "transparent"); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, size * .47, 0, Math.PI * 2); ctx.fill();
  for (let ring = 0; ring < 4; ring++) { ctx.strokeStyle = ring % 2 ? `${secondary}88` : `${primary}aa`; ctx.lineWidth = Math.max(1, size * (.0025 - ring * .00035)); ctx.setLineDash(ring === 2 ? [size * .012, size * .009] : []); ctx.beginPath(); ctx.arc(0, 0, size * (.22 + ring * .065), 0, Math.PI * 2); ctx.stroke(); }
  ctx.setLineDash([]);
  for (let i = 0; i < 64; i++) { const byte = bytes[i % 32], angle = i * Math.PI * 2 / 64; const inner = size * (.34 + (byte % 5) * .004); const outer = inner + size * (.018 + byte / 255 * .052); ctx.strokeStyle = i % 2 ? `${primary}cc` : `${secondary}aa`; ctx.lineWidth = size * (i % 8 === 0 ? .003 : .0012); ctx.beginPath(); ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner); ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer); ctx.stroke(); }
  const points = 8 + bytes[0] % 9; ctx.strokeStyle = `${secondary}cc`; ctx.lineWidth = size * .0022; ctx.shadowColor = primary; ctx.shadowBlur = size * .018; ctx.beginPath(); for (let i = 0; i <= points * 2; i++) { const angle = -Math.PI / 2 + i * Math.PI / points; const radius = size * (i % 2 ? .105 + bytes[i % 32] / 255 * .045 : .2); const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = secondary; ctx.textAlign = "center"; ctx.font = `${size * .034}px monospace`; ctx.fillText(hash.slice(0, 8).toUpperCase(), 0, size * .018); ctx.font = `${size * .014}px monospace`; ctx.fillStyle = `${secondary}aa`; ctx.fillText("SHA–256 PROVENANCE", 0, size * .065);
  ctx.resetTransform();
}

export function createProvenanceCertificateBlob(hash: string, artwork: string, house: string, primary: string, secondary: string): Promise<Blob | null> {
  const canvas = document.createElement("canvas"); canvas.width = 2048; canvas.height = 1400; const ctx = canvas.getContext("2d"); if (!ctx) return Promise.resolve(null);
  ctx.fillStyle = "#040405"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const glow = ctx.createRadialGradient(440, 700, 20, 440, 700, 760); glow.addColorStop(0, `${primary}48`); glow.addColorStop(.48, `${primary}14`); glow.addColorStop(1, "transparent"); ctx.fillStyle = glow; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = primary; ctx.lineWidth = 3; ctx.strokeRect(54, 54, canvas.width - 108, canvas.height - 108); ctx.strokeStyle = `${secondary}66`; ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);
  ctx.strokeStyle = `${secondary}2f`; ctx.lineWidth = 1; for (let x = 90; x < 1960; x += 46) { ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x, 1310); ctx.stroke(); } for (let y = 90; y < 1320; y += 46) { ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(1958, y); ctx.stroke(); }
  const seal = document.createElement("canvas"); drawProvenanceSeal(seal, hash, primary, secondary, 760); ctx.drawImage(seal, 110, 310, 760, 760);
  ctx.fillStyle = secondary; ctx.font = "30px monospace"; ctx.fillText("ONE MINUTE OF YOU · ROYAL HOUSES", 980, 220); ctx.fillStyle = "#9c94a4"; ctx.font = "21px monospace"; ctx.fillText("A NEW ONE-OF-ONE HAS ARRIVED", 980, 285); ctx.fillStyle = "#fff7e4"; ctx.font = "82px serif"; ctx.fillText(artwork.slice(0, 26), 980, 405); if (artwork.length > 26) ctx.fillText(artwork.slice(26, 52), 980, 500); ctx.fillStyle = primary; ctx.font = "44px serif"; ctx.fillText(house, 980, artwork.length > 26 ? 590 : 500); ctx.fillStyle = "#9c94a4"; ctx.font = "25px monospace"; ctx.fillText("DETERMINISTIC PROVENANCE CERTIFICATE", 980, artwork.length > 26 ? 665 : 590);
  ctx.fillStyle = "#d8d0c0"; ctx.font = "22px monospace"; const chunks = hash.match(/.{1,16}/g) || []; chunks.forEach((chunk, index) => ctx.fillText(chunk, 980, 650 + index * 42));
  ctx.fillStyle = "#8b8491"; ctx.font = "19px monospace"; ctx.fillText("ALGORITHM  SHA-256", 980, 1000); ctx.fillText("CREATED BY ONE MINUTE OF YOU", 980, 1045); ctx.fillText("STATUS     REPRODUCIBLE FROM SEED", 980, 1090); ctx.fillText("EDITION    1 / 1", 980, 1135); ctx.fillStyle = secondary; ctx.font = "22px monospace"; ctx.fillText("THE ART OF PRESENCE. THE PROOF OF YOU.", 980, 1230);
  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

export async function exportProvenanceCertificate(hash: string, artwork: string, house: string, primary: string, secondary: string) {
  const blob = await createProvenanceCertificateBlob(hash, artwork, house, primary, secondary); if (!blob) return;
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `one-minute-of-you-${hash.slice(0, 8)}.png`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
