// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./MemecoinFactory.sol";

contract Fundraise is Ownable, Pausable {
    IERC20 public usdc;
    MemecoinFactory public memecoinFactory;
    IUniswapV2Router02 public uniswapRouter;
    address public memecoin;
    
    uint256 public constant MAX_AMOUNT = 69000e6; // $69,000 USDC (6 decimals)
    uint256 public constant DURATION = 90 days;
    uint256 public constant LP_FEE_PERCENT = 1000; // 10% in basis points
    uint256 public immutable endTime;
    address public whitelistedClaimer;
    uint256 public totalDeposited;
    uint256 public fee; // Protocol fee in basis points
    address public feeCollector;
    address public lpFeeCollector;
    uint256 public totalProtocolFees;
    uint256 public totalLpFees;
    
    // Track depositor contributions
    mapping(address => uint256) public contributions;
    address[] public depositors;
    bool public memecoinsDistributed;
    
    event Deposited(address indexed sender, uint256 amount);
    event Removed(address indexed sender, uint256 amount);
    event Claimed(
        address indexed claimer, 
        uint256 totalAmount,
        uint256 lpFee,
        uint256 protocolFee,
        uint256 netAmount
    );
    event MemecoinsDistributed(
        address indexed memecoinAddress,
        uint256 totalSupply,
        uint256 lpAmount
    );
    event LiquidityLocked(
        address indexed pair,
        uint256 liquidity
    );

    constructor(
        address _usdc,
        address _owner,
        uint256 _protocolFee,
        address _feeCollector,
        address _lpFeeCollector,
        address _memecoinFactory,
        address _uniswapRouter
    ) Ownable(_owner) Pausable() {
        require(_protocolFee <= 1000, "Fundraise: fee cannot exceed 10%");
        require(_feeCollector != address(0), "Fundraise: invalid fee collector");
        require(_lpFeeCollector != address(0), "Fundraise: invalid LP fee collector");
        
        usdc = IERC20(_usdc);
        endTime = block.timestamp + DURATION;
        fee = _protocolFee;
        feeCollector = _feeCollector;
        lpFeeCollector = _lpFeeCollector;
        memecoinFactory = MemecoinFactory(_memecoinFactory);
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    function deposit(uint256 _amount) external whenNotPaused {
        require(_amount > 0, "Fundraise: amount must be > 0");
        require(totalDeposited + _amount <= MAX_AMOUNT, "Fundraise: exceeds max amount");
        
        if (contributions[msg.sender] == 0) {
            depositors.push(msg.sender);
        }
        contributions[msg.sender] += _amount;
        totalDeposited += _amount;
        
        require(usdc.transferFrom(msg.sender, address(this), _amount), "Fundraise: transfer failed");
        emit Deposited(msg.sender, _amount);
    }

    function claim() external {
        require(msg.sender == whitelistedClaimer, "Fundraise: not authorized");
        require(totalDeposited >= MAX_AMOUNT - 1000e6, "Fundraise: minimum amount not reached");
        require(!memecoinsDistributed, "Fundraise: memecoins already distributed");
        
        uint256 totalAmount = totalDeposited;

        // Calculate fees
        uint256 lpFeeAmount = (totalAmount * LP_FEE_PERCENT) / 10000;
        uint256 afterLpFee = totalAmount - lpFeeAmount;
        uint256 protocolFeeAmount = (afterLpFee * fee) / 10000;
        uint256 netAmount = afterLpFee - protocolFeeAmount;

        // Create memecoin
        string memory name = "FundraiseCoin";
        string memory symbol = "FUND";
        uint256 memeTokenSupply = 1_000_000_000 * 10**18; // 1 billion tokens
        memecoin = memecoinFactory.createMemecoin(
            name,
            symbol,
            memeTokenSupply
        );

        // Distribute 90% of memecoin supply to depositors
        uint256 tokensForDepositors = (memeTokenSupply * 90) / 100;
        for (uint i = 0; i < depositors.length; i++) {
            address depositor = depositors[i];
            uint256 share = (contributions[depositor] * tokensForDepositors) / totalDeposited;
            Memecoin(memecoin).transfer(depositor, share);
        }

        // Use 10% of memecoin supply and USDC LP fee for liquidity
        uint256 tokensForLiquidity = memeTokenSupply - tokensForDepositors;
        
        // Approve tokens for Uniswap
        Memecoin(memecoin).approve(address(uniswapRouter), tokensForLiquidity);
        usdc.approve(address(uniswapRouter), lpFeeAmount);

        // Add liquidity
        (,, uint256 liquidity) = uniswapRouter.addLiquidity(
            memecoin,
            address(usdc),
            tokensForLiquidity,
            lpFeeAmount,
            0, // Accept any amount of tokens
            0, // Accept any amount of USDC
            address(this),
            block.timestamp
        );

        // Get LP token address
        address pair = IUniswapV2Factory(uniswapRouter.factory()).getPair(memecoin, address(usdc));
        
        // Lock LP tokens by sending them to dead address
        IERC20(pair).transfer(address(0xdead), liquidity);

        // Transfer protocol fee
        usdc.transfer(feeCollector, protocolFeeAmount);

        // Transfer net amount to claimer
        usdc.transfer(whitelistedClaimer, netAmount);
        
        // Update state
        totalDeposited = 0;
        memecoinsDistributed = true;

        emit Claimed(
            whitelistedClaimer,
            totalAmount,
            lpFeeAmount,
            protocolFeeAmount,
            netAmount
        );
        
        emit MemecoinsDistributed(
            memecoin,
            memeTokenSupply,
            tokensForLiquidity
        );
        
        emit LiquidityLocked(
            pair,
            liquidity
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function checkAndPause() external {
        if (block.timestamp > endTime && totalDeposited < MAX_AMOUNT) {
            _pause();
        }
    }

    function setWhitelistedClaimer(address _claimer) external onlyOwner {
        whitelistedClaimer = _claimer;
    }
}