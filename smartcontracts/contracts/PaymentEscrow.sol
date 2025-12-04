// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PaymentEscrow
 * @dev Handles escrowed payments and refunds for parking bookings
 */
contract PaymentEscrow is Ownable, ReentrancyGuard {
    // Escrow structure
    struct Escrow {
        uint256 escrowId;
        uint256 bookingId;
        address payer;
        address payee;
        uint256 amount;
        address token; // address(0) for native CELO, otherwise ERC20 token address
        uint256 releaseTime;
        bool isReleased;
        bool isRefunded;
    }

    // State variables
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCounter;

    // Events
    event EscrowCreated(uint256 indexed escrowId, uint256 indexed bookingId, address indexed payer, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId, address indexed payee, uint256 amount);
    event EscrowRefunded(uint256 indexed escrowId, address indexed payer, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create an escrow for a booking payment
     */
    function createEscrow(
        uint256 bookingId,
        address payee,
        address token,
        uint256 releaseTime
    ) external payable nonReentrant returns (uint256) {
        require(msg.value > 0 || token != address(0), "Amount must be greater than 0");
        require(payee != address(0), "Invalid payee address");
        require(releaseTime > block.timestamp, "Release time must be in the future");

        escrowCounter++;
        uint256 amount = token == address(0) ? msg.value : 0;

        if (token != address(0)) {
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }

        escrows[escrowCounter] = Escrow({
            escrowId: escrowCounter,
            bookingId: bookingId,
            payer: msg.sender,
            payee: payee,
            amount: amount,
            token: token,
            releaseTime: releaseTime,
            isReleased: false,
            isRefunded: false
        });

        emit EscrowCreated(escrowCounter, bookingId, msg.sender, amount);
        return escrowCounter;
    }

    /**
     * @dev Release escrow payment to payee
     */
    function releaseEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.escrowId != 0, "Escrow does not exist");
        require(block.timestamp >= escrow.releaseTime, "Release time not reached");
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already processed");
        require(msg.sender == escrow.payee || msg.sender == owner(), "Not authorized");

        escrow.isReleased = true;

        if (escrow.token == address(0)) {
            // Native CELO
            (bool success, ) = escrow.payee.call{value: escrow.amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token
            IERC20(escrow.token).transfer(escrow.payee, escrow.amount);
        }

        emit EscrowReleased(escrowId, escrow.payee, escrow.amount);
    }

    /**
     * @dev Refund escrow payment to payer
     */
    function refundEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.escrowId != 0, "Escrow does not exist");
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already processed");
        require(msg.sender == escrow.payee || msg.sender == owner(), "Not authorized");

        escrow.isRefunded = true;

        if (escrow.token == address(0)) {
            // Native CELO
            (bool success, ) = escrow.payer.call{value: escrow.amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token
            IERC20(escrow.token).transfer(escrow.payer, escrow.amount);
        }

        emit EscrowRefunded(escrowId, escrow.payer, escrow.amount);
    }

    /**
     * @dev Get escrow details
     */
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }

    // Allow contract to receive native CELO
    receive() external payable {}
}

