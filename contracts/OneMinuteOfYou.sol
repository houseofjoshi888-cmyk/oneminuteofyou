// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title One Minute of You: Royal Houses
/// @notice A Base-native ERC-721 for a unique SHA-256 interaction seed and immutable metadata.
contract OneMinuteOfYou is ERC721URIStorage, ERC721Royalty, ERC721Pausable, Ownable2Step, ReentrancyGuard {
    error MintClosed(); error SoldOut(); error SeedAlreadyMinted(bytes32 seedHash); error InvalidMetadataURI(); error WalletLimitReached(); error IncorrectPayment(uint256 required, uint256 received); error WithdrawalFailed();
    uint256 public immutable maxSupply; uint256 public mintPrice; uint256 public maxPerWallet; uint256 public totalMinted; bool public publicMintOpen;
    mapping(bytes32 => bool) public seedMinted; mapping(address => uint256) public mintedByWallet;
    event OneMinuteMinted(uint256 indexed tokenId, address indexed collector, bytes32 indexed seedHash, string metadataURI);
    event PublicMintStateChanged(bool open); event MintPriceChanged(uint256 mintPrice); event MaxPerWalletChanged(uint256 maxPerWallet);

    constructor(address initialOwner, address royaltyReceiver, uint96 royaltyBps, uint256 initialMintPrice, uint256 collectionMaxSupply, uint256 initialMaxPerWallet) ERC721("One Minute of You: Royal Houses", "1MOY") Ownable(initialOwner) {
        require(collectionMaxSupply != 0, "max supply is zero"); require(initialMaxPerWallet != 0, "wallet limit is zero");
        maxSupply = collectionMaxSupply; mintPrice = initialMintPrice; maxPerWallet = initialMaxPerWallet; _setDefaultRoyalty(royaltyReceiver, royaltyBps);
    }

    function mintOneMinute(bytes32 seedHash, string calldata metadataURI) external payable nonReentrant whenNotPaused returns (uint256 tokenId) {
        if (!publicMintOpen) revert MintClosed(); if (totalMinted >= maxSupply) revert SoldOut(); if (seedMinted[seedHash]) revert SeedAlreadyMinted(seedHash); if (bytes(metadataURI).length == 0) revert InvalidMetadataURI(); if (mintedByWallet[msg.sender] >= maxPerWallet) revert WalletLimitReached(); if (msg.value != mintPrice) revert IncorrectPayment(mintPrice, msg.value);
        tokenId = _mintOneMinute(msg.sender, seedHash, metadataURI); mintedByWallet[msg.sender] += 1;
    }

    function ownerMint(address collector, bytes32 seedHash, string calldata metadataURI) external onlyOwner whenNotPaused returns (uint256 tokenId) {
        if (totalMinted >= maxSupply) revert SoldOut(); if (seedMinted[seedHash]) revert SeedAlreadyMinted(seedHash); if (bytes(metadataURI).length == 0) revert InvalidMetadataURI(); tokenId = _mintOneMinute(collector, seedHash, metadataURI);
    }

    function _mintOneMinute(address collector, bytes32 seedHash, string calldata metadataURI) private returns (uint256 tokenId) {
        seedMinted[seedHash] = true; tokenId = ++totalMinted; _safeMint(collector, tokenId); _setTokenURI(tokenId, metadataURI); emit OneMinuteMinted(tokenId, collector, seedHash, metadataURI);
    }
    function setPublicMintOpen(bool open) external onlyOwner { publicMintOpen = open; emit PublicMintStateChanged(open); }
    function setMintPrice(uint256 newMintPrice) external onlyOwner { mintPrice = newMintPrice; emit MintPriceChanged(newMintPrice); }
    function setMaxPerWallet(uint256 newMaxPerWallet) external onlyOwner { require(newMaxPerWallet != 0, "wallet limit is zero"); maxPerWallet = newMaxPerWallet; emit MaxPerWalletChanged(newMaxPerWallet); }
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner { _setDefaultRoyalty(receiver, feeNumerator); }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function withdraw(address payable recipient) external onlyOwner nonReentrant { (bool sent,) = recipient.call{value: address(this).balance}(""); if (!sent) revert WithdrawalFailed(); }
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) { return super.tokenURI(tokenId); }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Royalty) returns (bool) { return super.supportsInterface(interfaceId); }
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Pausable) returns (address) { return super._update(to, tokenId, auth); }
}
