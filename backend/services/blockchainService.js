const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI = require("../../blockchain/artifacts/contracts/Escrow.sol/Escrow.json").abi;

const escrowContract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet
);

async function createOrder(driverAddress, payment) {

  const tx = await escrowContract.createOrder(driverAddress, {
    value: payment
  });

  await tx.wait();

  return tx.hash;
}

async function submitDelivery(orderId, proofHash) {

  const tx = await escrowContract.submitDelivery(orderId, proofHash);

  await tx.wait();

  return tx.hash;
}

async function confirmDelivery(orderId) {

  const tx = await escrowContract.confirmDelivery(orderId);

  await tx.wait();

  return tx.hash;
}

async function raiseDispute(orderId) {

  const tx = await escrowContract.raiseDispute(orderId);

  await tx.wait();

  return tx.hash;
}

async function refundCustomer(orderId) {

  const tx = await escrowContract.refundCustomer(orderId);

  await tx.wait();

  return tx.hash;
}

module.exports = {
  createOrder,
  submitDelivery,
  confirmDelivery,
  raiseDispute,
  refundCustomer
};