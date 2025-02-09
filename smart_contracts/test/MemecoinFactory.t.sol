// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MemecoinFactory} from "../src/MemecoinFactory.sol";
import {Memecoin} from "../src/Memecoin.sol";

contract MemecoinFactoryTest is Test {
    MemecoinFactory public factory;
    
    function setUp() public {
        factory = new MemecoinFactory();
    }

    function testCreateMemecoin() public {
        address tokenAddress = factory.createMemecoin(
            "Test Token",
            "TEST",
            1_000_000 * 10**18
        );
        
        assertTrue(factory.isMemecoin(tokenAddress));
        assertEq(factory.totalMemecoinsCreated(), 1);
        assertEq(factory.getMemecoinsByCreator(address(this)), tokenAddress);
        
        Memecoin token = Memecoin(tokenAddress);
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.totalSupply(), 1_000_000 * 10**18);
    }
} 