import type { Address } from "viem";

export const ADMIN_WALLET = "0x69Bf308E5e30158072Cf9d2c6DE7b86F5Ae2f9B4" as Address;
export const HOUSE_WALLET = "0x6736d2eA9807297F0e56967361B9410854B86a5f" as Address;
export const SECONDARY_ROYALTY_BPS = 700;

export function isAdminWallet(address?: string) {
  return Boolean(address && address.toLowerCase() === ADMIN_WALLET.toLowerCase());
}
