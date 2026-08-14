export interface PreparedMint { seedHash: string; metadataURI: string; imageURI: string; animationURI: string; preparedAt: string; transactionHash?: string; tokenId?: string; }
const key = (seedHash: string) => `omoy:mint:${seedHash.toLowerCase()}`;
export function loadPreparedMint(seedHash: string): PreparedMint | null { try { const value = localStorage.getItem(key(seedHash)); return value ? JSON.parse(value) as PreparedMint : null; } catch { return null; } }
export function savePreparedMint(value: PreparedMint) { localStorage.setItem(key(value.seedHash), JSON.stringify(value)); }
export function listPreparedMints(): PreparedMint[] { try { return Object.keys(localStorage).filter(value=>value.startsWith("omoy:mint:")).map(value=>JSON.parse(localStorage.getItem(value) || "null") as PreparedMint).filter(Boolean).sort((a,b)=>b.preparedAt.localeCompare(a.preparedAt)); } catch { return []; } }
export function removePreparedMint(seedHash:string){localStorage.removeItem(key(seedHash));}
