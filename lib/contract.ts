import type { Address } from "viem";

export const BASE_CHAIN_ID = 8453;
export const MAX_SUPPLY = 5_200;
export const MINT_PRICE_WEI = 25_000_000_000_000_000n;
export const RENDERER_VERSION = "OMOY-KG-3.3.0";
export const RENDERER_VERSION_CODE = 330;
const configuredAddress = process.env.NEXT_PUBLIC_ONE_MINUTE_NFT_ADDRESS;
export const oneMinuteContractAddress = configuredAddress && /^0x[a-fA-F0-9]{40}$/.test(configuredAddress) ? configuredAddress as Address : undefined;
export const oneMinuteContractAbi = [
  { type: "event", name: "OneMinuteMinted", anonymous: false, inputs: [{ indexed: true, name: "tokenId", type: "uint256" }, { indexed: true, name: "collector", type: "address" }, { indexed: true, name: "seedHash", type: "bytes32" }, { indexed: false, name: "house", type: "uint8" }, { indexed: false, name: "traitsHash", type: "bytes32" }, { indexed: false, name: "rendererVersion", type: "uint16" }, { indexed: false, name: "metadataURI", type: "string" }] },
  { type: "function", name: "MINT_PRICE", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicMintOpen", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "paused", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "totalMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MAX_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "mintedByWallet", stateMutability: "view", inputs: [{ name: "collector", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPerWallet", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "mintStart", stateMutability: "view", inputs: [], outputs: [{ type: "uint64" }] },
  { type: "function", name: "mintEnd", stateMutability: "view", inputs: [], outputs: [{ type: "uint64" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "tokenOfOwnerByIndex", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "index", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }] },
  { type: "function", name: "mintOneMinute", stateMutability: "payable", inputs: [{ name: "seedHash", type: "bytes32" }, { name: "house", type: "uint8" }, { name: "traitsHash", type: "bytes32" }, { name: "rendererVersion", type: "uint16" }, { name: "metadataURI", type: "string" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ownerMint", stateMutability: "nonpayable", inputs: [{ name: "collector", type: "address" }, { name: "seedHash", type: "bytes32" }, { name: "house", type: "uint8" }, { name: "traitsHash", type: "bytes32" }, { name: "rendererVersion", type: "uint16" }, { name: "metadataURI", type: "string" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "setPublicMintOpen", stateMutability: "nonpayable", inputs: [{ name: "open", type: "bool" }], outputs: [] },
  { type: "function", name: "setMintWindow", stateMutability: "nonpayable", inputs: [{ name: "start", type: "uint64" }, { name: "end", type: "uint64" }], outputs: [] },
  { type: "function", name: "setMaxPerWallet", stateMutability: "nonpayable", inputs: [{ name: "newMaxPerWallet", type: "uint256" }], outputs: [] },
  { type: "function", name: "pause", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "unpause", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "HOUSE_WALLET", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "ROYALTY_BPS", stateMutability: "view", inputs: [], outputs: [{ type: "uint96" }] },
] as const;

export function openSeaItemUrl(tokenId: number | bigint) {
  return oneMinuteContractAddress ? `https://opensea.io/assets/base/${oneMinuteContractAddress}/${tokenId}` : undefined;
}

export function baseScanTokenUrl(tokenId: number | bigint) {
  return oneMinuteContractAddress ? `https://basescan.org/token/${oneMinuteContractAddress}?a=${tokenId}` : undefined;
}

export function ipfsGateway(uri?: string) {
  return uri?.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${uri.slice(7)}` : uri;
}
