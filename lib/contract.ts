import type { Address } from "viem";

export const BASE_CHAIN_ID = 8453;
export const MAX_SUPPLY = 500;
export const RENDERER_VERSION = "OMOY-KG-3.0.0";
const configuredAddress = process.env.NEXT_PUBLIC_ONE_MINUTE_NFT_ADDRESS;
export const oneMinuteContractAddress = configuredAddress && /^0x[a-fA-F0-9]{40}$/.test(configuredAddress) ? configuredAddress as Address : undefined;
export const oneMinuteContractAbi = [
  { type: "function", name: "mintPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicMintOpen", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "totalMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MAX_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "mintedByWallet", stateMutability: "view", inputs: [{ name: "collector", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }] },
  { type: "function", name: "mintOneMinute", stateMutability: "payable", inputs: [{ name: "seedHash", type: "bytes32" }, { name: "metadataURI", type: "string" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ownerMint", stateMutability: "nonpayable", inputs: [{ name: "collector", type: "address" }, { name: "seedHash", type: "bytes32" }, { name: "metadataURI", type: "string" }], outputs: [{ type: "uint256" }] },
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
