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
    enum Role {
        None,
        Student,
        Professor,
        Staff,
        Admin
    }

    using Counters for Counters.Counter;
    // using Types for Types.Role; // Custom Enum Type

    mapping(address => bool) public _authPersonal; // Make Private After testing

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CryptoPass", "CPT") {
        address owner = owner();
        address remix_addr_02 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // Testing
        address ws_addr = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db; // Change after testing

        _authPersonal[owner] = true;
        _authPersonal[ws_addr] = true;
        _authPersonal[remix_addr_02] = true; // Testing

        createUserRole(owner, Types.Role.Admin); // Making the Owner an Admin
        safeMint(owner);
        // The Authorized Account that can mint SBTs

        createSBT(ws_addr, Types.Role.Admin); // Makes the WS an Admin and Creates a SBT for it
        // createSBT(owner, Types.Role.Admin);     // Makes the Owner an Admin and Creates a SBT for it
    }

    modifier onlyOne(address to) {
        require(
            balanceOf(to) == 0,
            "CryptoPass: You already possess a SBT and you may only have one"
        );
        _; // This is a placeholder for the code of the modified function
    }

    modifier onlyAuthAcc() {
        require(
            _authPersonal[msg.sender],
            "CryptoPass: You are NOT Authorized to create an SBT"
        );
        _; // This is a placeholder for the code of the modified function
    }

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

    // Creates SBT Tokens | This is done by Department's Secretary Personal
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

    // Cancel SBT
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) onlyAuthAcc {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function balanceOf(
        address _SBTowner
    ) public view override(ERC721, IERC721) onlyAuthAcc returns (uint256) {
        return super.balanceOf(_SBTowner);
    }

    // Calls the "getRole" from CPRoles.sol to obtain the Role of a specific user
    function getUserRole(
        address caller
    ) public view onlyAuthAcc returns (Types.Role) {
        return getRole(caller);
    }

    // Calls the "getRole" from CPRoles.sol to obtain self's Role
    /*
    How to handle this in the WS:
        const roleInt = await contract.methods.getRole(userAddress).call();
        const roles = ["None", "Student", "Professor", "Staff", "Admin"];
        const roleStr = roles[roleInt];
        console.log(roleStr); // Will print the string representation of the role
    */

    function changeUserRole(
        address userAddr,
        Types.Role role
    ) external onlyAuthAcc {
        changeRole(userAddr, role);
    }

    function createUserRole(address userAddr, Types.Role role) private {
        createRole(userAddr, role);
    }

    function createSBT(address _userAddr, Types.Role _role) public onlyAuthAcc {
        require(
            _userAddr != address(0),
            "CryptoPass: Probably provided wrong address."
        );
        require(
            Types.Role.Admin == getUserRole(msg.sender),
            "CryptoPass: Only the Owner can create Admins."
        );
        safeMint(_userAddr); // Create the SBT for the user
        createUserRole(_userAddr, _role); // Assign a Role to user
    }

    function authorizeAccount(address _addr) external onlyOwner {
        _authPersonal[_addr] = true;
    }

    function hasSBTuser(address _userAddr) external view returns (bool result) {
        return balanceOf(_userAddr) > 0;
    }

    // Publicly Available Functions
    function hasSBT() external view returns (bool result) {
        return balanceOf(tx.origin) > 0;
    }

    function showMsgSender() external view returns (address result) {
        return msg.sender;
    }
}
