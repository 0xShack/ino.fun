// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Fundraise.sol";

contract FundraiseFactory {
    address public immutable usdcAddress;
    uint256 public defaultFee;
    address public feeCollector;
    mapping(address => bool) public fundraises;
    
    event FundraiseCreated(address indexed fundraise, address indexed owner);
    event DefaultFeeUpdated(uint256 newFee);
    event FeeCollectorUpdated(address indexed newCollector);

    constructor(
        address _usdcAddress,
        uint256 _defaultFee,
        address _feeCollector
    ) {
        require(_usdcAddress != address(0), "FundraiseFactory: invalid USDC address");
        require(_defaultFee <= 1000, "FundraiseFactory: fee cannot exceed 10%");
        require(_feeCollector != address(0), "FundraiseFactory: invalid fee collector");
        
        usdcAddress = _usdcAddress;
        defaultFee = _defaultFee;
        feeCollector = _feeCollector;
    }

    function setDefaultFee(uint256 _fee) external {
        require(_fee <= 1000, "FundraiseFactory: fee cannot exceed 10%");
        defaultFee = _fee;
        emit DefaultFeeUpdated(_fee);
    }

    function setFeeCollector(address _feeCollector) external {
        require(_feeCollector != address(0), "FundraiseFactory: invalid address");
        feeCollector = _feeCollector;
        emit FeeCollectorUpdated(_feeCollector);
    }

    function createFundraise() external returns (address) {
        Fundraise fundraise = new Fundraise(
            usdcAddress,
            msg.sender,
            defaultFee,
            feeCollector
        );
        fundraises[address(fundraise)] = true;
        
        emit FundraiseCreated(address(fundraise), msg.sender);
        return address(fundraise);
    }

    function isFundraise(address _fundraise) external view returns (bool) {
        return fundraises[_fundraise];
    }
}