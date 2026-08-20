// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title One Minute of You: Royal Houses
/// @notice A Base-native ERC-721 for a unique SHA-256 interaction seed and immutable metadata.
contract OneMinuteOfYou is ERC721URIStorage, ERC721Royalty, ERC721Pausable, ERC721Enumerable, Ownable2Step, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 5_200;
    uint256 public constant MINT_PRICE = 0.025 ether;
    address public constant ADMIN_WALLET = 0x69Bf308E5e30158072Cf9d2c6DE7b86F5Ae2f9B4;
    address payable public constant HOUSE_WALLET = payable(0x6736d2eA9807297F0e56967361B9410854B86a5f);
    uint96 public constant ROYALTY_BPS = 700;
    error MintClosed(); error InvalidMintWindow(); error SoldOut(); error SeedAlreadyMinted(bytes32 seedHash); error InvalidMetadataURI(); error InvalidProvenance(); error RendererAlreadyRegistered(uint16 version); error UnsupportedRenderer(uint16 version); error WalletLimitReached(); error IncorrectPayment(uint256 required, uint256 received); error WithdrawalFailed();
    uint256 public maxPerWallet; uint256 public totalMinted; uint64 public mintStart; uint64 public mintEnd; bool public publicMintOpen;
    mapping(bytes32 => bool) public seedMinted; mapping(address => uint256) public mintedByWallet; mapping(uint16 => bytes32) public rendererDigest;
    struct Provenance { bytes32 seedHash; bytes32 traitsHash; uint8 house; uint16 rendererVersion; }
    struct AirdropItem { address collector; bytes32 seedHash; bytes32 traitsHash; uint8 house; uint16 rendererVersion; string metadataURI; }
    mapping(uint256 => Provenance) private _provenance;
    event OneMinuteMinted(uint256 indexed tokenId, address indexed collector, bytes32 indexed seedHash, uint8 house, bytes32 traitsHash, uint16 rendererVersion, string metadataURI);
    event PublicMintStateChanged(bool open); event MintWindowChanged(uint64 start, uint64 end); event MaxPerWalletChanged(uint256 maxPerWallet); event RendererRegistered(uint16 indexed version, bytes32 indexed digest); event TreasuryWithdrawal(uint256 amount);

    constructor(uint256 initialMaxPerWallet, uint64 initialMintStart, uint64 initialMintEnd, bytes32 initialRendererDigest) ERC721("One Minute of You: Royal Houses", "1MOY") Ownable(ADMIN_WALLET) {
        require(initialMaxPerWallet != 0, "wallet limit is zero");
        if (initialMintEnd != 0 && initialMintEnd <= initialMintStart) revert InvalidMintWindow(); if (initialRendererDigest == bytes32(0)) revert InvalidProvenance();
        maxPerWallet = initialMaxPerWallet; mintStart = initialMintStart; mintEnd = initialMintEnd; rendererDigest[330] = initialRendererDigest; emit RendererRegistered(330, initialRendererDigest); _setDefaultRoyalty(HOUSE_WALLET, ROYALTY_BPS);
    }

    function mintOneMinute(bytes32 seedHash, uint8 house, bytes32 traitsHash, uint16 rendererVersion, string calldata metadataURI) external payable nonReentrant whenNotPaused returns (uint256 tokenId) {
        if (!publicMintOpen || block.timestamp < mintStart || (mintEnd != 0 && block.timestamp > mintEnd)) revert MintClosed(); if (mintedByWallet[msg.sender] >= maxPerWallet) revert WalletLimitReached(); if (msg.value != MINT_PRICE) revert IncorrectPayment(MINT_PRICE, msg.value);
        tokenId = _mintOneMinute(msg.sender, seedHash, house, traitsHash, rendererVersion, metadataURI); mintedByWallet[msg.sender] += 1;
    }

    function ownerMint(address collector, bytes32 seedHash, uint8 house, bytes32 traitsHash, uint16 rendererVersion, string calldata metadataURI) external onlyOwner whenNotPaused returns (uint256 tokenId) {
        tokenId = _mintOneMinute(collector, seedHash, house, traitsHash, rendererVersion, metadataURI);
    }

    function airdrop(AirdropItem[] calldata items) external onlyOwner whenNotPaused {
        uint256 length = items.length; require(length != 0 && length <= 100, "invalid batch");
        for (uint256 i; i < length; ++i) { AirdropItem calldata item = items[i]; _mintOneMinute(item.collector, item.seedHash, item.house, item.traitsHash, item.rendererVersion, item.metadataURI); }
    }

    function _mintOneMinute(address collector, bytes32 seedHash, uint8 house, bytes32 traitsHash, uint16 rendererVersion, string calldata metadataURI) private returns (uint256 tokenId) {
        if (totalMinted >= MAX_SUPPLY) revert SoldOut(); if (seedMinted[seedHash]) revert SeedAlreadyMinted(seedHash); if (bytes(metadataURI).length < 8) revert InvalidMetadataURI(); if (seedHash == bytes32(0) || traitsHash == bytes32(0) || house > 4 || rendererVersion == 0) revert InvalidProvenance(); if (rendererDigest[rendererVersion] == bytes32(0)) revert UnsupportedRenderer(rendererVersion);
        seedMinted[seedHash] = true; tokenId = ++totalMinted; _provenance[tokenId] = Provenance(seedHash, traitsHash, house, rendererVersion); _safeMint(collector, tokenId); _setTokenURI(tokenId, metadataURI); emit OneMinuteMinted(tokenId, collector, seedHash, house, traitsHash, rendererVersion, metadataURI);
    }
    function setPublicMintOpen(bool open) external onlyOwner { publicMintOpen = open; emit PublicMintStateChanged(open); }
    function setMintWindow(uint64 start, uint64 end) external onlyOwner { if (end != 0 && end <= start) revert InvalidMintWindow(); mintStart = start; mintEnd = end; emit MintWindowChanged(start, end); }
    function setMaxPerWallet(uint256 newMaxPerWallet) external onlyOwner { require(newMaxPerWallet != 0, "wallet limit is zero"); maxPerWallet = newMaxPerWallet; emit MaxPerWalletChanged(newMaxPerWallet); }
    function registerRenderer(uint16 version, bytes32 digest) external onlyOwner { if (version == 0 || digest == bytes32(0)) revert InvalidProvenance(); if (rendererDigest[version] != bytes32(0)) revert RendererAlreadyRegistered(version); rendererDigest[version] = digest; emit RendererRegistered(version, digest); }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function provenanceOf(uint256 tokenId) external view returns (Provenance memory) { _requireOwned(tokenId); return _provenance[tokenId]; }
    /// @notice Sends every primary-sale payment to the fixed House treasury. No alternate recipient is possible.
    function withdraw() external onlyOwner nonReentrant { uint256 amount = address(this).balance; (bool sent,) = HOUSE_WALLET.call{value: amount}(""); if (!sent) revert WithdrawalFailed(); emit TreasuryWithdrawal(amount); }
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) { return super.tokenURI(tokenId); }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Royalty, ERC721Enumerable) returns (bool) { return super.supportsInterface(interfaceId); }
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Pausable, ERC721Enumerable) returns (address) { return super._update(to, tokenId, auth); }
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) { super._increaseBalance(account, value); }
}
