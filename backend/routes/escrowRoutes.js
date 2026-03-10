const express = require("express");
console.log("Escrow routes loaded 🚀");
const router = express.Router();

const {
  getEscrows,
  createEscrow,
  getEscrowById,
  releaseFunds,
  refundEscrow,
  getEscrowStatus
} = require("../models/escrowModel");

const {
  createOrder,
  submitDelivery,
  confirmDelivery,
  refundCustomer
} = require("../services/blockchainService");

/*
Test Route
*/
router.get("/test", (req, res) => {
  res.json({ message: "Escrow routes working" });
});

/*
Get All Escrows
*/
router.get("/escrows", async (req, res) => {
  try {
    const data = await getEscrows();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/*
Create Escrow (Customer books ride)
*/
router.post("/createEscrow", async (req, res) => {
  try {

    const { buyer_wallet, seller_wallet, amount } = req.body;

    console.log("Creating escrow:", buyer_wallet, seller_wallet, amount);

    // blockchain order creation
    const result = await createOrder(seller_wallet, amount);

    // database entry
    const escrow = await createEscrow(
      result.orderId,
      process.env.CONTRACT_ADDRESS,
      result.txHash,
      amount
    );

    res.json({
      message: "Escrow created",
      escrow,
      transaction: result.txHash,
      orderId: result.orderId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/*
Driver submits delivery proof
*/
router.post("/submitDelivery/:orderId", async (req, res) => {
  try {

    const { orderId } = req.params;

    const proofHash = "DELIVERY_PROOF_123"; // temporary placeholder

    const txHash = await submitDelivery(orderId, proofHash);

    res.json({
      message: "Delivery submitted",
      transaction: txHash
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/*
Customer confirms delivery → release funds
*/
router.post("/confirmDelivery/:orderId", async (req, res) => {
  try {

    const { orderId } = req.params;

    // blockchain call
    const txHash = await confirmDelivery(orderId);

    // database update
    const escrow = await releaseFunds(orderId);

    res.json({
      message: "Delivery confirmed",
      escrow,
      transaction: txHash
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/*
Admin refunds customer
*/
router.post("/refund/:orderId", async (req, res) => {
  try {

    const { orderId } = req.params;

    const txHash = await refundCustomer(orderId);

    const escrow = await refundEscrow(orderId);

    res.json({
      message: "Refund processed",
      escrow,
      transaction: txHash
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/*
Get single escrow
*/
router.get("/escrow/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const escrow = await getEscrowById(id);

    res.json(escrow);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/status/:orderId", async (req, res) => {

  try {

    const { orderId } = req.params;

    const escrow = await getEscrowStatus(orderId);

    if (!escrow) {
      return res.status(404).json({ error: "Escrow not found" });
    }

    res.json({
      orderId: escrow.order_id,
      status: escrow.status,
      amount: escrow.amount,
      contractAddress: escrow.contract_address
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


module.exports = router;

