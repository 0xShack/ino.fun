// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Memecoin} from "../src/Memecoin.sol";

contract MemecoinTest is Test {
    Memecoin public token;
    address public owner;
    
    function setUp() public {
        owner = address(this);
        token = new Memecoin(
            "Test Token",
            "TEST",
            1_000_000_000 * 10**18,
            owner
        );
    }

    function testInitialState() view public {
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.totalSupply(), 1_000_000_000 * 10**18);
        assertEq(token.owner(), owner);
        assertEq(token.transfersEnabled(), false);
    }
} 