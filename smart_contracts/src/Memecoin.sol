// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Memecoin is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens with 18 decimals
    bool public transfersEnabled;
    mapping(address => bool) public isExcludedFromLimits;
    uint256 public maxTransferAmount;
    uint256 public maxWalletAmount;
    
    event TransfersEnabled(bool enabled);
    event ExcludedFromLimits(address indexed account, bool excluded);
    event MaxTransferAmountUpdated(uint256 amount);
    event MaxWalletAmountUpdated(uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) Ownable(owner) Pausable() {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        transfersEnabled = false;
        isExcludedFromLimits[owner] = true;
        isExcludedFromLimits[address(this)] = true;
        
        // Set default limits
        maxTransferAmount = MAX_SUPPLY * 1 / 100; // 1% of max supply
        maxWalletAmount = MAX_SUPPLY * 2 / 100;   // 2% of max supply
        
        _mint(owner, initialSupply);
        _transferOwnership(owner);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function enableTransfers(bool enabled) external onlyOwner {
        transfersEnabled = enabled;
        emit TransfersEnabled(enabled);
    }

    function setExcludedFromLimits(address account, bool excluded) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }

    function setMaxTransferAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        maxTransferAmount = amount;
        emit MaxTransferAmountUpdated(amount);
    }

    function setMaxWalletAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        maxWalletAmount = amount;
        emit MaxWalletAmountUpdated(amount);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(to, amount);
    }

}