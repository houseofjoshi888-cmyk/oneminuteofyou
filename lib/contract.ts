import type { Address } from "viem";

export const BASE_CHAIN_ID = 8453;
const configuredAddress = process.env.NEXT_PUBLIC_ONE_MINUTE_NFT_ADDRESS;
export const oneMinuteContractAddress = configuredAddress && /^0x[a-fA-F0-9]{40}$/.test(configuredAddress) ? configuredAddress as Address : undefined;
export const oneMinuteContractAbi = [
  { type: "function", name: "mintPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicMintOpen", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "mintOneMinute", stateMutability: "payable", inputs: [{ name: "seedHash", type: "bytes32" }, { name: "metadataURI", type: "string" }], outputs: [{ type: "uint256" }] },
] as const;
