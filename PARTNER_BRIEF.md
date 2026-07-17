# One Minute of You — Partner Brief

## The simple idea

**One Minute of You** turns sixty seconds of a person's touch, mouse, and pointer movement into a one-of-one generative artwork. The work is not an uploaded photograph or a copied drawing. It is a deterministic visual portrait created from the rhythm, pace, direction, pauses, pressure, and coverage of a single recorded minute.

The collection is called **One Minute of You: Royal Houses**. Every finished work is assigned, deterministically, to one of five Houses:

- House of Ruby
- House of Sapphire
- House of Emerald
- House of Amethyst
- House of Gold

Each House gives a work a distinct colour language, ornament, title vocabulary, rarity treatment, and royal chronicle. The purpose is to make the collection feel cohesive and collectible while keeping every edition visibly individual.

## What a collector experiences

1. The visitor enters the site and begins a sixty-second recording.
2. They move a pointer, touch a screen, tap, pause, or draw naturally on the full-screen canvas.
3. The app measures interaction characteristics rather than treating the literal line as the artwork.
4. The measurements are serialized and hashed with SHA-256.
5. That hash becomes the deterministic seed for the artwork, House, name, rarity, provenance seal, and metadata.
6. The visitor sees a live preview, their House, title, rarity rank, and a short Royal Chronicle.
7. They can export a 4096 × 4096 artwork PNG, a 12-second living loop, a JSON metadata file, and a provenance certificate.
8. Once the contract is deployed and configured, they can mint the work as a Base NFT using a pinned IPFS metadata URI.

The original hand-drawn path is deliberately **not rendered behind the final work**. It influences the seed and visual outcome, but is not displayed as a replay of the user's drawing.

## What makes the artwork unique

The system extracts deterministic interaction features such as:

- total distance travelled
- average speed and acceleration
- curvature and directional entropy
- pauses and tap count
- screen coverage
- pressure where supported by the device
- a normalized gesture trace used as an input, not a visible stroke

The canonical feature data is SHA-256 hashed. The hash is split into numeric seed words and passed to a deterministic pseudo-random generator. Therefore, the same seed and configuration always produce the same result.

This allows a collector to verify the artwork's origin without storing their raw recording as a public asset.

## Visual system

The first group of compositions uses a high-density flow-field particle engine. Full exports use 100,000 deterministic particles at 4096 × 4096 resolution; previews use a lighter subset to keep phones and laptops responsive.

The collection also includes non-particle surface compositions:

- Royal Tilework
- Silk Weave
- Stained Glass
- Topographic Relief
- Calligraphic Gesture

These use full Canvas paintings rather than particle simulation. Their forms are generated from the seed and measured interaction character, not copied from the visitor's visible line. Across the collection, the palette combines black, gold, royal gemstones, glow, glints, ornament, and the House crest language.

## Royal Houses and provenance

The SHA-256 seed determines:

- the Royal House and its colours
- one of the available compositions
- the edition name
- rarity rank
- the visual parameters for the artwork
- a circular provenance seal
- the text of the Royal Chronicle

The provenance seal is a circular, seed-derived mark shown with each result and included in the certificate. It creates a visual relationship between the artwork, its metadata, and the deterministic source hash.

## The Base NFT model

The project includes a Base-compatible Solidity ERC-721 contract: `contracts/OneMinuteOfYou.sol`.

### Contract behaviour

The contract is designed for Base Mainnet (chain ID `8453`) and includes:

- ERC-721 ownership and transfers
- one unique `bytes32` SHA-256 seed per token; duplicate seeds are rejected
- immutable token metadata URIs stored on mint
- collection maximum supply
- mint price in ETH
- per-wallet mint limit
- owner-controlled public mint opening and closing
- emergency pause and unpause
- owner withdrawal of proceeds
- two-step ownership transfer support
- ERC-2981 royalty signalling for compatible marketplaces

The central mint method is:

```solidity
mintOneMinute(bytes32 seedHash, string metadataURI)
```

The frontend sends the interaction SHA-256 value as `seedHash` and an `ipfs://…` metadata URI. The contract checks that the seed has never been minted, checks supply and wallet rules, collects the configured mint price, and then mints the token.

### Important truth about launch status

The contract source and mint interface are built, but **there is no live Base deployment address configured yet**. The live site will correctly keep on-chain minting unavailable until a verified address is supplied. This is intentional: no one should be asked to send funds to an undeployed or unverified contract.

## Metadata and media

Each minted NFT should have permanent, pinned storage for:

- the 4096 × 4096 PNG artwork
- the optional 12-second WebM living loop
- the JSON metadata file
- the SHA-256 seed and provenance details
- collection traits: House, gemstone, rarity, ornament, composition, edition, and interaction-derived attributes

Recommended process:

1. Export the art, animation, and JSON.
2. Upload and pin all files to IPFS (or another permanent storage provider).
3. Replace `image` and `animation_url` in the metadata with their pinned `ipfs://` addresses.
4. Pin the final JSON and copy its `ipfs://…/metadata.json` URI.
5. Paste that URI into the Base mint form and confirm the wallet transaction.

The metadata URI is immutable once minted. It should be reviewed carefully before confirming a mint.

## Privacy position

The creative experience should be communicated as privacy-conscious:

- The recording happens in the visitor's browser.
- The final art depends on extracted features and a hash, not on publishing a raw replay of the user's hand path.
- The raw interaction data is not intended to be a public NFT asset.
- The final public provenance is the seed/hash and published metadata.

Before public launch, this wording should be reviewed alongside the actual analytics, hosting, and upload providers used in production.

## What is already built

- Animated landing page and recording journey
- 60-second mouse, touch, and pointer recorder
- Deterministic interaction analysis and SHA-256 seeding
- Royal House assignment, naming, rarity, chronicles, and seal
- Particle and non-particle composition families
- Performance-conscious preview rendering and high-resolution export
- PNG, living-loop, metadata, and certificate exports
- RainbowKit wallet connection set to Base
- Base ERC-721 contract source and mint UI wiring
- Private live site and GitHub repository

## What must happen before Mainnet launch

1. **Agree collection rules**: supply, mint price, wallet limit, royalty percentage, House distribution, reserve allocation, and launch date.
2. **Choose custody**: use a multisig as contract owner and royalty receiver rather than one personal wallet.
3. **Test on Base Sepolia**: deploy the exact contract, test successful mints, failed duplicate-seed mints, pause controls, price checks, and token metadata on an explorer.
4. **Security review**: get an independent Solidity review before accepting Mainnet funds. This is essential; source code is not the same thing as an audit.
5. **Choose permanent storage**: select an IPFS pinning/storage provider and define the artwork-to-metadata upload workflow.
6. **Deploy and verify on Base Mainnet**: verify the contract source on the Base explorer.
7. **Configure the live app**: set `NEXT_PUBLIC_ONE_MINUTE_NFT_ADDRESS` to the verified Mainnet address and publish the update.
8. **Create legal and public-facing copy**: terms, privacy notice, mint refund policy, royalty disclosure, and intellectual-property language.
9. **Run a small closed mint**: invite a limited group, test the full flow from recording to wallet transaction to marketplace display, then open public mint.

## Decisions for partners

| Decision | Why it matters | Suggested starting point |
| --- | --- | --- |
| Total supply | Defines scarcity and technical cap | Limited, intentionally chosen cap rather than open-ended supply |
| Mint price | Shapes audience and treasury | Decide after a Sepolia/closed-mint test |
| Royalty | Signals creator economics | 5% is a common starting point, subject to marketplace support |
| Owner wallet | Controls contract settings and withdrawals | 2-of-3 multisig |
| Per-wallet limit | Prevents a small number of wallets taking the collection | 1–3 depending on supply |
| Metadata host | Ensures works remain viewable | Pinned IPFS with a documented backup plan |
| House allocation | Controls collection narrative | Keep deterministic House assignment for fairness |
| Mint structure | Determines whether every visitor can mint | Public release, allowlist, or staged House drops |

## Short partner pitch

> One Minute of You is a generative art and NFT experience that transforms one private minute of movement into a permanent royal portrait. A visitor's rhythm—not their image—is distilled into a cryptographic seed. That seed creates a unique artwork, House, name, rarity, provenance seal, and on-chain Base NFT. The collection combines the intimacy of performance with the collectibility of a coherent visual world: Royal Houses, black-and-gold ornament, gemstone colour, and verifiable one-of-one provenance.

## Useful links

- Live experience: https://one-minute-of-you.anshvita98.chatgpt.site
- Source repository: https://github.com/houseofjoshi888-cmyk/oneminuteofyou
- Base network information: https://docs.base.org/base-chain/quickstart/connecting-to-base
- OpenZeppelin ERC-721 and royalty reference: https://docs.openzeppelin.com/contracts/5.x/api/token/erc721
