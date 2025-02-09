// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MemecoinFactory} from "../src/MemecoinFactory.sol";

contract MemecoinFactoryScript is Script {
    function run() public {
        vm.startBroadcast();
        
        new MemecoinFactory();
        
        vm.stopBroadcast();
    }
} 