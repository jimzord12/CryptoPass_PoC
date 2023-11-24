// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Types.sol";

contract RolesManager {
    mapping(address => Types.Role) private roles;

    function getRole(address userAddr) internal view returns (Types.Role) {
        return roles[userAddr];
    }

    function changeRole(address userAddr, Types.Role newRole) internal {
         roles[userAddr] = newRole;
    }

    function createRole(address userAddr, Types.Role role) internal {
        require(roles[userAddr] == Types.Role.None, "You already have a Role");
        roles[userAddr] = role;
    }

}
