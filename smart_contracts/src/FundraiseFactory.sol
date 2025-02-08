// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Fundraise.sol";

contract FundraiseFactory {
    address public immutable usdcAddress;
    mapping(address => bool) public fundraises;
    
    event FundraiseCreated(address indexed fundraise, address indexed owner);

    constructor(address _usdcAddress) {
        require(_usdcAddress != address(0), "FundraiseFactory: invalid USDC address");
        usdcAddress = _usdcAddress;
    }

    function createFundraise() external returns (address) {
        Fundraise fundraise = new Fundraise(usdcAddress, msg.sender);
        fundraises[address(fundraise)] = true;
        
        emit FundraiseCreated(address(fundraise), msg.sender);
        return address(fundraise);
    }

    function isFundraise(address _fundraise) external view returns (bool) {
        return fundraises[_fundraise];
    }
}