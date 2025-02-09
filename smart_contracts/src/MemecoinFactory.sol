// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Memecoin.sol";

contract MemecoinFactory {
    event MemecoinCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        address indexed owner
    );

    mapping(address => bool) public isMemecoin;
    mapping(address => address) public memecoinsCreated;
    uint256 public totalMemecoinsCreated;

    function createMemecoin(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(initialSupply > 0, "Initial supply must be > 0");
        require(initialSupply <= 1_000_000_000 * 10**18, "Initial supply exceeds max supply");

        Memecoin memecoin = new Memecoin(
            name,
            symbol,
            initialSupply,
            msg.sender
        );

        address tokenAddress = address(memecoin);
        isMemecoin[tokenAddress] = true;
        memecoinsCreated[msg.sender] = tokenAddress;
        totalMemecoinsCreated++;

        emit MemecoinCreated(
            tokenAddress,
            name,
            symbol,
            initialSupply,
            msg.sender
        );

        return tokenAddress;
    }

    function getMemecoinsByCreator(address creator) external view returns (address) {
        return memecoinsCreated[creator];
    }
}