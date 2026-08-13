import { NextResponse } from "next/server";

export const runtime = "edge";

async function pinFile(jwt: string, file: File, name: string) {
  const body = new FormData();
  body.set("network", "public"); body.set("name", name); body.set("file", file, name);
  const response = await fetch("https://uploads.pinata.cloud/v3/files", { method: "POST", headers: { Authorization: `Bearer ${jwt}` }, body });
  if (!response.ok) throw new Error(`IPFS storage rejected ${name} (${response.status}).`);
  const payload = await response.json() as { data?: { cid?: string } };
  if (!payload.data?.cid) throw new Error(`IPFS storage did not return a CID for ${name}.`);
  return payload.data.cid;
}

export async function POST(request: Request) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) return NextResponse.json({ error: "Permanent IPFS storage is not configured yet." }, { status: 503 });
  try {
    const input = await request.formData();
    const artwork = input.get("artwork"); const rawMetadata = input.get("metadata");
    if (!(artwork instanceof File) || typeof rawMetadata !== "string") return NextResponse.json({ error: "Artwork and metadata are required." }, { status: 400 });
    if (artwork.size > 12_000_000) return NextResponse.json({ error: "Artwork exceeds the 12 MB mint preparation limit." }, { status: 413 });
    const metadata = JSON.parse(rawMetadata) as Record<string, unknown>;
    const seed = String(metadata.seed || "");
    if (!/^[a-f0-9]{64}$/i.test(seed)) return NextResponse.json({ error: "The artwork seed is invalid." }, { status: 400 });
    const imageCid = await pinFile(jwt, artwork, `${seed}-artwork.png`);
    const liveHtml = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#020203}img{width:100%;height:100%;object-fit:contain;animation:breathe 48s ease-in-out infinite}@keyframes breathe{50%{transform:scale(1.018) rotate(.2deg)}}</style><img src="ipfs://${imageCid}" alt="One Minute of You living artwork">`;
    const animationCid = await pinFile(jwt, new File([liveHtml], "living-artwork.html", { type: "text/html" }), `${seed}-living-artwork.html`);
    metadata.image = `ipfs://${imageCid}`; metadata.animation_url = `ipfs://${animationCid}`;
    const metadataCid = await pinFile(jwt, new File([JSON.stringify(metadata, null, 2)], "metadata.json", { type: "application/json" }), `${seed}-metadata.json`);
    return NextResponse.json({ metadataURI: `ipfs://${metadataCid}`, imageURI: metadata.image, animationURI: metadata.animation_url, seed });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mint preparation failed." }, { status: 500 });
  }
}
