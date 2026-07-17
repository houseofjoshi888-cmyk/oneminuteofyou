# One Minute of You contract

`OneMinuteOfYou.sol` is a Base Mainnet (chain ID `8453`) ERC-721. Every token stores one unique SHA-256 interaction seed and an immutable metadata URI. Pin the artwork, animation, and JSON to permanent storage such as IPFS before minting.

Deploy and test on Base Sepolia (chain ID `84532`) before Mainnet. With Foundry installed, run `forge install OpenZeppelin/openzeppelin-contracts@v5.2.0` once, then `forge build`. The constructor accepts `initialOwner`, `royaltyReceiver`, `royaltyBps`, `initialMintPrice`, `collectionMaxSupply`, and `initialMaxPerWallet`. Configure `NEXT_PUBLIC_ONE_MINUTE_NFT_ADDRESS` with the verified Base Mainnet address before enabling frontend mints.

`mintOneMinute(bytes32 seedHash, string metadataURI)` rejects duplicate seeds, protects supply and wallet limits, and emits `OneMinuteMinted`. ERC-2981 signals royalties to supporting marketplaces; it cannot force royalty payment.
