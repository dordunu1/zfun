// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./NFT721.sol";
import "./NFT1155.sol";
import "./ICollectionTypes.sol";

contract NFTFactory is Ownable, ReentrancyGuard, ICollectionTypes {
    using Clones for address;

    address public immutable nft721Implementation;
    address public immutable nft1155Implementation;
    
    uint256 public sepoliaFee = 0.015 ether;
    uint256 public polygonFee = 20 ether;

    mapping(address => address[]) public creatorCollections;
    mapping(address => string) public collectionMetadata;

    event CollectionCreated(
        address indexed creator,
        address indexed collection,
        string collectionType,
        string name,
        string symbol,
        uint256 maxSupply,
        uint256 mintPrice,
        uint256 maxPerWallet,
        uint256 releaseDate,
        uint256 mintEndDate,
        bool infiniteMint
    );

    constructor(address _nft721Implementation, address _nft1155Implementation) 
        Ownable(msg.sender)
    {
        require(_nft721Implementation != address(0), "Invalid 721 implementation");
        require(_nft1155Implementation != address(0), "Invalid 1155 implementation");
        nft721Implementation = _nft721Implementation;
        nft1155Implementation = _nft1155Implementation;
    }

    function _createConfig(
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        uint256 _releaseDate,
        uint256 _mintEndDate,
        bool _infiniteMint,
        address _paymentToken,
        bool _enableWhitelist
    ) internal pure returns (CollectionConfig memory) {
        return CollectionConfig({
            maxSupply: _maxSupply,
            mintPrice: _mintPrice,
            maxPerWallet: _maxPerWallet,
            releaseDate: _releaseDate,
            mintEndDate: _mintEndDate,
            infiniteMint: _infiniteMint,
            paymentToken: _paymentToken,
            enableWhitelist: _enableWhitelist
        });
    }

    function createNFTCollection(
        string memory _type,
        string memory _name,
        string memory _symbol,
        string memory _metadataURI,
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        uint256 _releaseDate,
        uint256 _mintEndDate,
        bool _infiniteMint,
        address _paymentToken,
        bool _enableWhitelist
    ) external payable nonReentrant {
        require(msg.value >= (block.chainid == 11155111 ? sepoliaFee : polygonFee), "Insufficient fee");

        address implementation = keccak256(bytes(_type)) == keccak256(bytes("ERC721")) 
            ? nft721Implementation 
            : nft1155Implementation;

        address collection = implementation.clone();
        CollectionConfig memory config = _createConfig(
            _maxSupply, _mintPrice, _maxPerWallet, _releaseDate, 
            _mintEndDate, _infiniteMint, _paymentToken, _enableWhitelist
        );

        if (keccak256(bytes(_type)) == keccak256(bytes("ERC721"))) {
            NFT721(collection).initialize(_name, _symbol, _metadataURI, config, msg.sender);
        } else {
            NFT1155(collection).initialize(_name, _symbol, _metadataURI, config, msg.sender);
        }

        creatorCollections[msg.sender].push(collection);
        collectionMetadata[collection] = _metadataURI;

        emit CollectionCreated(
            msg.sender, collection, _type, _name, _symbol,
            _maxSupply, _mintPrice, _maxPerWallet,
            _releaseDate, _mintEndDate, _infiniteMint
        );
    }

    function updateFees(uint256 _sepoliaFee, uint256 _polygonFee) external onlyOwner {
        sepoliaFee = _sepoliaFee;
        polygonFee = _polygonFee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
} 