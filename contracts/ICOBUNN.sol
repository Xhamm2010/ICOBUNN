// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./BunnToken.sol";

contract ICOBUNN {
    using SafeERC20 for IERC20;
    // Admin address
    address public admin;

    // BUNN token address
    address public token_address;

    // Mapping of registered addresses
    mapping(address => bool) public registered_addresses;

    // Mapping of claimed addresses
    mapping(address => bool) public claimed_addresses;

    // ICO start time
    uint256 public ico_start_time;

    // ICO duration
    uint256 public constant ICO_DURATION = 24 * 60 * 60; // 24 hours in seconds

    // Constructor
    constructor(address _admin, address _token_address) {
        admin = _admin;
        token_address = _token_address;
        ico_start_time = block.timestamp;
    }

    // Function to register for the ICO
    function register() external payable {
        require(msg.value == 0.01 ether, "Registration fee must be 0.01 ETH");
        require(!registered_addresses[msg.sender], "Already registered");
        require(block.timestamp < ico_start_time + ICO_DURATION, "ICO has ended");

        registered_addresses[msg.sender] = true;
    }

    // Function to claim ICO tokens
    function claim(address _recipient) external {
        require(registered_addresses[msg.sender], "Not registered");
        require(block.timestamp > ico_start_time + ICO_DURATION, "ICO has not ended");
        require(!claimed_addresses[msg.sender], "Already claimed");

        IERC20Metadata bunntoken = IERC20Metadata(token_address);
        uint256 amountToTransfer = 50 * 10**bunntoken.decimals(); // 50 tokens

        // Ensure the ICO contract is approved to spend tokens on behalf of the admin
        require(bunntoken.allowance(admin, address(this)) >= amountToTransfer, "Allowance not sufficient");

        // Transfer tokens using transferFrom
        bunntoken.transferFrom(admin, _recipient, amountToTransfer);
        
        claimed_addresses[msg.sender] = true;
    }
}