const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI =
require("../../blockchain/artifacts/contracts/Escrow.sol/Escrow.json").abi;

/*
Wallets
Customer → creates order
Driver → submits delivery
*/

const customerWallet = new ethers.Wallet(
  process.env.CUSTOMER_PRIVATE_KEY,
  provider
);

const driverWallet = new ethers.Wallet(
  process.env.DRIVER_PRIVATE_KEY,
  provider
);

const customerContract = new ethers.Contract(
  contractAddress,
  contractABI,
  customerWallet
);

const driverContract = new ethers.Contract(
  contractAddress,
  contractABI,
  driverWallet
);

async function createOrder(driverAddress, payment) {

  console.log("Creating blockchain order...");

  const tx = await customerContract.createOrder(driverAddress, {
    value: ethers.parseEther(payment.toString())
  });

  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();

  console.log("Transaction confirmed");

  /*
  Extract orderId from event
  */

  const event = receipt.logs
    .map(log => {
      try {
        return customerContract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(e => e && e.name === "OrderCreated");

  const orderId = Number(event.args.orderId);

  console.log("Blockchain order id:", orderId);

  return {
    orderId,
    txHash: tx.hash
  };
}

async function submitDelivery(orderId, proofHash) {

  console.log("Submitting delivery proof...");

  const tx = await driverContract.submitDelivery(orderId, proofHash);

  await tx.wait();

  console.log("Delivery proof submitted");

  return tx.hash;
}

async function confirmDelivery(orderId) {

  console.log("Customer confirming delivery...");

  const tx = await customerContract.confirmDelivery(orderId);

  await tx.wait();

  console.log("Payment released");

  return tx.hash;
}

async function refundCustomer(orderId) {

  const tx = await customerContract.refundCustomer(orderId);

  await tx.wait();

  return tx.hash;
}

module.exports = {
  createOrder,
  submitDelivery,
  confirmDelivery,
  refundCustomer
};