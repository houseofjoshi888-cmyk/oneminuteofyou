import { NextResponse } from "next/server";
import { keccak256, toBytes } from "viem";
import { RENDERER_VERSION } from "@/lib/contract";

export const runtime = "edge";
const allowedHouses = ["House of Peridot", "House of Ruby", "House of Sapphire", "House of Turquoise", "House of Gold"];
const requests = new Map<string, { count: number; reset: number }>();

function limited(request: Request) {
  const key = request.headers.get("cf-connecting-ip") || "anonymous"; const now = Date.now(); const current = requests.get(key);
  if (!current || current.reset < now) { requests.set(key, { count: 1, reset: now + 60_000 }); return false; }
  current.count += 1; return current.count > 4;
}

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
  if (limited(request)) return NextResponse.json({ error: "Too many mint preparation requests. Wait one minute and retry." }, { status: 429, headers: { "Retry-After": "60" } });
  const jwt = process.env.PINATA_JWT;
  if (!jwt) return NextResponse.json({ error: "Permanent IPFS storage is not configured yet." }, { status: 503 });
  try {
    const input = await request.formData();
    const artwork = input.get("artwork"); const rawMetadata = input.get("metadata");
    if (!(artwork instanceof File) || typeof rawMetadata !== "string") return NextResponse.json({ error: "Artwork and metadata are required." }, { status: 400 });
    if (artwork.size > 12_000_000) return NextResponse.json({ error: "Artwork exceeds the 12 MB mint preparation limit." }, { status: 413 });
    const metadata = JSON.parse(rawMetadata) as Record<string, unknown> & { attributes?: Array<{ trait_type?: string; value?: string | number }> };
    const seed = String(metadata.seed || "");
    if (!/^[a-f0-9]{64}$/i.test(seed)) return NextResponse.json({ error: "The artwork seed is invalid." }, { status: 400 });
    if (metadata.renderer_version !== RENDERER_VERSION) return NextResponse.json({ error: "This renderer version is not accepted for minting." }, { status: 400 });
    if (!Array.isArray(metadata.attributes) || metadata.attributes.length < 8 || metadata.attributes.length > 64) return NextResponse.json({ error: "The artwork traits are incomplete." }, { status: 400 });
    const house = String(metadata.attributes.find(item => item.trait_type === "Royal House")?.value || ""); const houseIndex = allowedHouses.indexOf(house);
    if (houseIndex < 0) return NextResponse.json({ error: "The Royal House is invalid." }, { status: 400 });
    const canonicalTraits = JSON.stringify([...metadata.attributes].sort((a,b)=>String(a.trait_type).localeCompare(String(b.trait_type))));
    const traitsHash = keccak256(toBytes(canonicalTraits));
    // Raw gesture and motion records stay on the collector's device. Public metadata stores only derived traits and commitments.
    delete metadata.movement;
    metadata.motion_commitment = `0x${seed}`; metadata.renderer_frozen = true;
    const imageCid = await pinFile(jwt, artwork, `${seed}-artwork.png`);
    const liveHtml = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#020203}canvas{width:100%;height:100%;object-fit:contain}</style><canvas></canvas><script>const c=document.querySelector('canvas'),x=c.getContext('2d'),im=new Image;im.crossOrigin='anonymous';im.src='https://ipfs.io/ipfs/${imageCid}';im.onload=()=>{c.width=im.naturalWidth;c.height=im.naturalHeight;const b=document.createElement('canvas');b.width=c.width;b.height=c.height;const q=b.getContext('2d');q.drawImage(im,0,0);const d=q.getImageData(0,0,c.width,c.height).data,p=[];let s=0x${seed.slice(0,8)};const r=()=>((s=Math.imul(s^s>>>15,1|s),s^=s+Math.imul(s^s>>>7,61|s))^s>>>14)>>>0;for(let i=0;i<18000;i++){let z=(r()%(c.width*c.height))|0,j=z*4;if(d[j]+d[j+1]+d[j+2]>42)p.push([z%c.width,(z/c.width)|0,1+r()%3,d[j],d[j+1],d[j+2]])}let t=0;function f(){t=(t+.0018)%2;let a=t<=1?t:2-t,n=(a*a*(3-2*a)*p.length)|0;x.fillStyle='#020203';x.fillRect(0,0,c.width,c.height);for(let i=0;i<n;i++){let v=p[i];x.fillStyle='rgb('+v[3]+','+v[4]+','+v[5]+')';x.fillRect(v[0],v[1],v[2],v[2])}requestAnimationFrame(f)}f()}</script>`;
    const animationCid = await pinFile(jwt, new File([liveHtml], "living-artwork.html", { type: "text/html" }), `${seed}-living-artwork.html`);
    metadata.image = `ipfs://${imageCid}`; metadata.animation_url = `ipfs://${animationCid}`;
    const metadataCid = await pinFile(jwt, new File([JSON.stringify(metadata, null, 2)], "metadata.json", { type: "application/json" }), `${seed}-metadata.json`);
    return NextResponse.json({ metadataURI: `ipfs://${metadataCid}`, imageURI: metadata.image, animationURI: metadata.animation_url, seed, houseIndex, traitsHash, rendererVersion: 330 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mint preparation failed." }, { status: 500 });
  }
}
