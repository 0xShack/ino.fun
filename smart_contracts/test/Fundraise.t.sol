// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Fundraise} from "../src/Fundraise.sol";
import {MemecoinFactory} from "../src/MemecoinFactory.sol";
import {Memecoin} from "../src/Memecoin.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV2Factory} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract FundraiseTest is Test {
    Fundraise public fundraise;
    MemecoinFactory public factory;
    address public owner;
    address public feeCollector;
    address public lpFeeCollector;
    address public claimer;
    address public depositor1;
    address public depositor2;
    
    // Mock USDC token
    address constant USDC = address(0x1);
    // Mock Uniswap addresses
    address constant UNISWAP_FACTORY = address(0x2);
    address constant UNISWAP_ROUTER = address(0x3);
    
    uint256 constant PROTOCOL_FEE = 500; // 5%
    uint256 constant MAX_AMOUNT = 69000e6; // $69,000 USDC
    
    function setUp() public {
        owner = makeAddr("owner");
        feeCollector = makeAddr("feeCollector");
        lpFeeCollector = makeAddr("lpFeeCollector");
        claimer = makeAddr("claimer");
        depositor1 = makeAddr("depositor1");
        depositor2 = makeAddr("depositor2");
        
        // Deploy MemecoinFactory
        factory = new MemecoinFactory();
        
        // Deploy Fundraise
        vm.prank(owner);
        fundraise = new Fundraise(
            USDC,
            owner,
            PROTOCOL_FEE,
            feeCollector,
            lpFeeCollector,
            address(factory),
            UNISWAP_ROUTER
        );
        
        // Mock USDC and Uniswap behavior
        vm.mockCall(
            USDC,
            abi.encodeWithSelector(IERC20.transferFrom.selector),
            abi.encode(true)
        );
        vm.mockCall(
            USDC,
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true)
        );
        vm.mockCall(
            USDC,
            abi.encodeWithSelector(IERC20.approve.selector),
            abi.encode(true)
        );
        vm.mockCall(
            UNISWAP_ROUTER,
            abi.encodeWithSelector(bytes4(keccak256("factory()"))),
            abi.encode(UNISWAP_FACTORY)
        );
        vm.mockCall(
            UNISWAP_ROUTER,
            abi.encodeWithSelector(bytes4(keccak256("addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"))),
            abi.encode(1, 1, 1)
        );

        // Mock USDC balances
        vm.mockCall(
            USDC,
            abi.encodeWithSelector(IERC20.balanceOf.selector),
            abi.encode(MAX_AMOUNT)
        );
    }

    function testFullFundraise() public {
        // Set claimer
        vm.prank(owner);
        fundraise.setWhitelistedClaimer(claimer);
        
        // Deposit from two users
        vm.prank(depositor1);
        fundraise.deposit(MAX_AMOUNT / 2);
        
        vm.prank(depositor2);
        fundraise.deposit(MAX_AMOUNT / 2);
        
        // Claim and create memecoin
        vm.prank(claimer);
        fundraise.claim();
        
        // Get memecoin address
        address memecoinAddr = fundraise.memecoin();
        Memecoin memecoin = Memecoin(memecoinAddr);
        
        // Verify memecoin creation
        assertTrue(factory.isMemecoin(memecoinAddr));
        assertEq(memecoin.name(), "FundraiseCoin");
        assertEq(memecoin.symbol(), "FUND");
        
        // Calculate expected amounts
        uint256 totalSupply = 1_000_000_000 * 10**18;
        uint256 tokensForDepositors = (totalSupply * 90) / 100;
        uint256 tokensForLiquidity = totalSupply - tokensForDepositors;
        
        // Verify depositor balances (45% each of 90% of total supply)
        assertEq(
            memecoin.balanceOf(depositor1),
            tokensForDepositors / 2
        );
        assertEq(
            memecoin.balanceOf(depositor2),
            tokensForDepositors / 2
        );
        
        // Verify fees
        uint256 lpFee = (MAX_AMOUNT * 1000) / 10000; // 10%
        uint256 afterLpFee = MAX_AMOUNT - lpFee;
        uint256 protocolFee = (afterLpFee * PROTOCOL_FEE) / 10000;
        uint256 netAmount = afterLpFee - protocolFee;
        
        // Verify USDC transfers
        vm.expectCall(
            USDC,
            abi.encodeWithSelector(
                IERC20.transfer.selector,
                feeCollector,
                protocolFee
            )
        );
        vm.expectCall(
            USDC,
            abi.encodeWithSelector(
                IERC20.transfer.selector,
                claimer,
                netAmount
            )
        );
        
        // Verify LP creation
        vm.expectCall(
            USDC,
            abi.encodeWithSelector(
                IERC20.approve.selector,
                UNISWAP_ROUTER,
                lpFee
            )
        );
        vm.expectCall(
            memecoinAddr,
            abi.encodeWithSelector(
                IERC20.approve.selector,
                UNISWAP_ROUTER,
                tokensForLiquidity
            )
        );
    }
} 