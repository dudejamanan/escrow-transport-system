const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI =
require("../../blockchain/artifacts/contracts/Escrow.sol/Escrow.json").abi;

/*
Wallet roles
Customer → creates order
Driver → submits delivery
Admin → dispute resolution
*/

const customerWallet = new ethers.Wallet(
  process.env.CUSTOMER_PRIVATE_KEY,
  provider
);

const driverWallet = new ethers.Wallet(
  process.env.DRIVER_PRIVATE_KEY,
  provider
);

const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
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

const adminContract = new ethers.Contract(
  contractAddress,
  contractABI,
  adminWallet
);

/*
Create Escrow Order
*/

async function createOrder(driverAddress, payment) {

  console.log("Creating blockchain order...");

  const tx = await customerContract.createOrder(driverAddress, {
    value: ethers.parseEther(payment.toString())
  });

  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();

  console.log("Transaction confirmed");

  const event = receipt.logs
    .map(log => {
      try {
        return customerContract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(e => e && e.name === "OrderCreated");

  if (!event) {
    throw new Error("OrderCreated event not found");
  }

  const orderId = Number(event.args.orderId);

  console.log("Blockchain order id:", orderId);

  return {
    orderId,
    txHash: tx.hash
  };
}

/*
Driver submits delivery proof
*/

async function submitDelivery(orderId, proofHash) {

  console.log("Driver submitting delivery proof...");

  const tx = await driverContract.submitDelivery(orderId, proofHash);

  console.log("Transaction:", tx.hash);

  await tx.wait();

  console.log("Delivery proof confirmed");

  return tx.hash;
}

/*
Customer confirms delivery
*/

async function confirmDelivery(orderId) {

  console.log("Customer confirming delivery...");

  const tx = await customerContract.confirmDelivery(orderId);

  await tx.wait();

  console.log("Payment released");

  return tx.hash;
}

/*
Admin processes refund
*/

async function refundCustomer(orderId) {

  console.log("Admin processing refund...");

  const tx = await adminContract.refundCustomer(orderId);

  await tx.wait();

  console.log("Refund completed");

  return tx.hash;
}

module.exports = {
  createOrder,
  submitDelivery,
  confirmDelivery,
  refundCustomer
};