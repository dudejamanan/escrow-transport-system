const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
);

const wallet = new ethers.Wallet(
  "YOUR_PRIVATE_KEY",
  provider
);

const contractAddress = "YOUR_CONTRACT_ADDRESS";

const contractABI = [
  "function releaseFunds(uint256 escrowId) public",
  "function refund(uint256 escrowId) public"
];

const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet
);
