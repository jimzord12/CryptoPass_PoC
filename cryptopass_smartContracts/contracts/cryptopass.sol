// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Types.sol";
import "./CPRolesManager.sol";

// WS Address: 0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3

/*
    Improvement Considerations:
        1. ReentrancyGuard (OZ) to protext external SC calls like rolesContract
        2. AccessControl (OZ) for advanced Role Managements
        3. Pausable (OZ) for Emergency stop of operations
        4. Find a way to centralized the performed Auth Checks, now they all over the place
*/

contract CryptoPass is ERC721, ERC721URIStorage, Ownable, RolesManager {
    using Counters for Counters.Counter;

    mapping(address => bool) public _authPersonal; // Make Private After testing

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CryptoPass", "CPT") {
        // Creating the Contract's Owner
        address owner = owner();

        // Making the Owner an Authorized Account
        _authPersonal[owner] = true;

        // Making the Owner an Admin
        createUserRole(owner, Types.Role.Admin);

        // We mint a SBT for the Owner,
        // Its the some as calling "createSBT" but we bypass some checks
        safeMint(owner);
    }

    // This modifier is used to check if the user already has a SBT AND
    // does not allow the creation of a 2nd one
    modifier onlyOne(address to) {
        require(
            balanceOf(to) == 0,
            "CryptoPass: You already possess a SBT and you may only have one"
        );
        _; // This is a placeholder for the code of the modified function
    }

    // This modifier is used to check if the user is authorized to create a SBT
    modifier onlyAuthAcc() {
        require(
            _authPersonal[msg.sender],
            "CryptoPass: You are NOT Authorized to create an SBT"
        );
        _;
    }

    // This restricts the ability to transfer an SBT
    // It is an internal function that is called by the ERC721 and here we override it
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(
            from == address(0),
            "CryptoPass: This is an SBT Token, Its not transferable."
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // This function is used to create an NFT
    // The NFT becomes an SBT because of the resitrictions we have set above
    function safeMint(address to) private onlyOne(to) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Cancel/Destroy an SBT
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) onlyAuthAcc {
        super._burn(tokenId);
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.
    function balanceOf(
        address _SBTowner
    ) public view override(ERC721, IERC721) onlyAuthAcc returns (uint256) {
        return super.balanceOf(_SBTowner);
    }

    // Calls the "getRole" from CPRolesManager.sol to obtain the Role of a specific user
    function getUserRole(
        address caller
    ) public view onlyAuthAcc returns (Types.Role) {
        return getRole(caller);
    }

    // Gives a Role to a specific user
    function createUserRole(address userAddr, Types.Role role) private {
        createRole(userAddr, role);
    }

    // >>> Publicly Available Functions <<<

    // Changes the Role of a specific user (from 'Student' to 'Professor' for example)
    function changeUserRole(
        address userAddr,
        Types.Role role
    ) external onlyAuthAcc {
        changeRole(userAddr, role);
    }

    // This function is used to authorize a specific address to create SBTs
    function authorizeAccount(address _addr) external onlyOwner {
        _authPersonal[_addr] = true;
    }

    // This is the most important function of the contract!
    // It creates a SBT for a specific user and assigns a Role to it
    function createSBT(address _userAddr, Types.Role _role) public onlyAuthAcc {
        require(
            _userAddr != address(0),
            "CryptoPass: Probably provided wrong address."
        );
        require(
            Types.Role.Admin == getUserRole(msg.sender),
            "CryptoPass: Only the Admins can create SBTs."
        );
        safeMint(_userAddr); // Create the SBT for the user
        createUserRole(_userAddr, _role); // Assign a Role to user
    }

    // This function checks if a specific User has a SBT
    function hasSBTuser(address _userAddr) external view returns (bool result) {
        return balanceOf(_userAddr) > 0;
    }

    // This function checks if the msg.sender has a SBT
    function hasSBT() external view returns (bool result) {
        return balanceOf(tx.origin) > 0;
    }

    // This function is used for Testing purposes
    function showMsgSender() external view returns (address result) {
        return msg.sender;
    }

    // Calls the "getRole" from CPRoles.sol to obtain self's Role
    /*
    How to handle this in the WS:
        const roleInt = await contract.methods.getRole(userAddress).call();
        const roles = ["None", "Student", "Professor", "Staff", "Admin"];
        const roleStr = roles[roleInt];
        console.log(roleStr); // Will print the string representation of the role
    */
}
