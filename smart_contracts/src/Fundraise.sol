// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Fundraise is Ownable, Pausable {
    IERC20 public usdc;
    uint256 public constant MAX_AMOUNT = 69000e6; // $69,000 USDC (6 decimals)
    uint256 public constant DURATION = 90 days;
    uint256 public immutable endTime;
    address public whitelistedClaimer;
    uint256 public totalRaised;

    event Deposited(address indexed sender, uint256 amount);
    event Removed(address indexed sender, uint256 amount);
    event Claimed(address indexed claimer, uint256 amount);
    event WhitelistedClaimerSet(address indexed claimer);

    constructor(address _usdc, address _owner) Ownable(_owner) Pausable() {
        usdc = IERC20(_usdc);
        endTime = block.timestamp + DURATION;
    }

    modifier notExpired() {
        require(block.timestamp <= endTime, "Fundraise: expired");
        _;
    }

    function setWhitelistedClaimer(address _claimer) external onlyOwner {
        require(_claimer != address(0), "Fundraise: invalid address");
        whitelistedClaimer = _claimer;
        emit WhitelistedClaimerSet(_claimer);
    }

    function deposit(uint256 _amount) external whenNotPaused notExpired {
        require(_amount > 0, "Fundraise: amount must be > 0");
        require(totalRaised + _amount <= MAX_AMOUNT, "Fundraise: exceeds max amount");

        totalRaised += _amount;
        require(usdc.transferFrom(msg.sender, address(this), _amount), "Fundraise: transfer failed");
        
        emit Deposited(msg.sender, _amount);
    }

    function remove(uint256 _amount) external {
        require(usdc.balanceOf(address(this)) >= _amount, "Fundraise: insufficient balance");
        
        uint256 senderBalance = usdc.balanceOf(msg.sender);
        require(senderBalance >= _amount, "Fundraise: insufficient sender balance");
        
        totalRaised -= _amount;
        require(usdc.transfer(msg.sender, _amount), "Fundraise: transfer failed");
        
        emit Removed(msg.sender, _amount);
    }

    function claim() external {
        require(msg.sender == whitelistedClaimer, "Fundraise: not authorized");
        require(usdc.balanceOf(address(this)) > 0, "Fundraise: no funds to claim");

        uint256 amount = usdc.balanceOf(address(this));
        require(usdc.transfer(whitelistedClaimer, amount), "Fundraise: transfer failed");
        
        emit Claimed(whitelistedClaimer, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Auto-pause if max amount not reached after duration
    function checkAndPause() external {
        if (block.timestamp > endTime && totalRaised < MAX_AMOUNT) {
            _pause();
        }
    }
}