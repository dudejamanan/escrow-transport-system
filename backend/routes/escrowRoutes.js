const express = require("express");
console.log("Escrow routes loaded 🚀");
const router = express.Router();

const {
  getEscrows,
  createEscrow,
  getEscrowById,
  releaseFunds,
  refundEscrow
} = require("../models/escrowModel");

const {
  createOrder,
  confirmDelivery,
  refundCustomer
} = require("../services/mockBlockchainService");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Escrow routes working" });
});

router.get("/escrows", async (req, res) => {
  const data = await getEscrows();
  res.json(data);
});

router.post("/createEscrow", async (req, res) => {

  try {

    const { buyer_wallet, seller_wallet, amount } = req.body;

    // 1️⃣ call blockchain
    const txHash = await createOrder(seller_wallet, amount);

    // 2️⃣ store in database
    const escrow = await createEscrow(
      buyer_wallet,
      seller_wallet,
      amount
    );

    res.json({
      message: "Escrow created",
      escrow,
      transaction: txHash
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


router.post("/confirmDelivery/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // blockchain call
    const txHash = await confirmDelivery(id);

    // database update
    const escrow = await releaseFunds(id);

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


router.post("/refund/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const txHash = await refundCustomer(id);

    const escrow = await refundEscrow(id);

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


router.get("/escrow/:id", async (req, res) => {

  const { id } = req.params;

  const escrow = await getEscrowById(id);

  res.json(escrow);

});

module.exports = router;