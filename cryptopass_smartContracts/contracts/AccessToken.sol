// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Assuming CryptoPass contract has an interface like this:
interface ICryptoPass {
    enum Role {
        None,
        Student,
        Professor,
        Secretary,
        Admin
    }

    function getUserRole(address user) external view returns (Role);

    function hasSBTuser(address to) external view returns (bool result);
}

// This "IERC721Receiver", allows the contract to receive the SoulBound NFT
contract AccessToken is ERC721, Ownable, IERC721Receiver {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct TokenData {
        uint256 id; // The Token's ID
        ICryptoPass.Role role; // This is an Enum, see Types.sol
        uint256 exp; // expiration block number
    }

    mapping(uint256 => TokenData) private _tokenDetails;
    mapping(address => uint256) private _ownerToTokenId;

    ICryptoPass public cryptoPassContract;

    // Number of blocks roughly equivalent to 5 minutes depends on the block time. For Ethereum's ~15 second block time, it's around 20.
    uint256 public expirationBlocks = 20;

    event TokenMinted(uint256 tokenId, ICryptoPass.Role role, uint256 exp);

    constructor(
        address _cryptoPassAddress
    ) ERC721("CryptoPassAccessToken", "CPATK") {
        cryptoPassContract = ICryptoPass(_cryptoPassAddress); // Connecting the 2 Contracts, CryptoPass must be deployed first!
    }

    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function checkTokenExpTime(uint16 _numberOfBlocks) external onlyOwner {
        expirationBlocks = _numberOfBlocks;
    }

    function mintToken(address to) public returns (uint256) {
        require(
            uint(cryptoPassContract.getUserRole(msg.sender)) > 2,
            "CPATK: Caller Does not possess enough Access Level"
        );
        require(
            cryptoPassContract.hasSBTuser(to),
            "CPATK: Caller Does not possess an SBT"
        );
        if (balanceOf(to) > 0) {
            // Does already have a AccessToken?
            // Yes, the user has AT...
            uint userAccessTokenID = getTokenId(to); // Let's grab its ID;
            require(
                _isTokenExpired(userAccessTokenID),
                "CPATK: Token has NOT expired yet."
            ); // It must be expired to continue
            // Here, we know that the user has an expired AT...
            _burn(userAccessTokenID); // So let's burn it!
            // So a new one can be created...
        }

        require(
            balanceOf(to) == 0,
            "CPATK: User already has an Unused and Unexpired AccessToken"
        );

        uint256 tokenId = _tokenIdCounter.current(); // Getting current Token ID
        _tokenIdCounter.increment(); // New token ID
        _mint(to, tokenId); // Minting new Token
        _ownerToTokenId[to] = tokenId; // Store the mapping of owner to tokenId

        ICryptoPass.Role role = cryptoPassContract.getUserRole(to); // Get the Role from CryptoPass SC

        uint256 exp = block.number + expirationBlocks; // Create a

        _tokenDetails[tokenId] = TokenData({id: tokenId, role: role, exp: exp});

        emit TokenMinted(tokenId, role, exp); // Emitting the event with details

        return tokenId;
    }

    function changeCryptoPassAddress(
        address _newContractAddr
    ) external onlyOwner {
        cryptoPassContract = ICryptoPass(_newContractAddr);
    }

    function getTokenData(
        uint256 tokenId
    ) external view returns (TokenData memory) {
        require(_exists(tokenId), "CPATK: Token does not exist");
        return _tokenDetails[tokenId];
    }

    function useToken(uint256 tokenId) external {
        // require(ownerOf(tokenId) == msg.sender, "Not the owner of this token");
        require(
            uint(cryptoPassContract.getUserRole(msg.sender)) > 1,
            "CPATK: Insufficient Access Level"
        ); // Restricting Access
        require(!_isTokenExpired(tokenId), "CPATK: Token has expired");
        require(
            balanceOf(ownerOf(tokenId)) == 1,
            "CPATK: User does not possess an AccessToken"
        );
        address tokenOwner = ownerOf(tokenId);
        _burn(tokenId); // Token can only be used once
        delete _ownerToTokenId[tokenOwner]; // Clear the mapping
    }

    function _isTokenExpired(uint256 tokenId) internal view returns (bool) {
        return block.number > _tokenDetails[tokenId].exp;
    }

    function getTokenId(address owner) public view returns (uint256) {
        require(
            uint(cryptoPassContract.getUserRole(msg.sender)) > 2,
            "CPATK: Insufficient Access Level"
        ); // Restricting Access
        return _ownerToTokenId[owner];
    }
}
