export interface PreparedMint { seedHash: string; metadataURI: string; imageURI: string; animationURI: string; preparedAt: string; transactionHash?: string; tokenId?: string; }
const key = (seedHash: string) => `omoy:mint:${seedHash.toLowerCase()}`;
export function loadPreparedMint(seedHash: string): PreparedMint | null { try { const value = localStorage.getItem(key(seedHash)); return value ? JSON.parse(value) as PreparedMint : null; } catch { return null; } }
export function savePreparedMint(value: PreparedMint) { localStorage.setItem(key(value.seedHash), JSON.stringify(value)); }
