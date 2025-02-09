// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Memecoin} from "../src/Memecoin.sol";

contract MemecoinScript is Script {
    function run() public {
        vm.startBroadcast();
        
        // Deploy with example values
        new Memecoin(
            "Example Token",
            "EXT",
            1_000_000_000 * 10**18, // 1B tokens
            msg.sender
        );
        
        vm.stopBroadcast();
    }
} 