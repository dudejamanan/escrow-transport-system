const express = require("express");
const router = express.Router();

const { getEscrows, createEscrow, getEscrowById, releaseFunds, refundEscrow} = require("../models/escrowModel");

router.get("/escrows", async (req, res) => {
  const data = await getEscrows();
  res.json(data);
});


router.post("/createEscrow", async (req, res) => {

  const { buyer_wallet, seller_wallet, amount } = req.body;

  const escrow = await createEscrow(
    buyer_wallet,
    seller_wallet,
    amount
  );

  res.json(escrow);

});

router.get("/escrow/:id", async (req, res) => {
  const { id } = req.params;
  const escrow = await getEscrowById(id);
  res.json(escrow);
});

router.post("/releaseFunds/:id", async (req, res) => {
  const { id } = req.params;
  const escrow = await releaseFunds(id);
  res.json(escrow);

});

router.post("/refund/:id", async (req, res) => {
  const { id } = req.params;

  const escrow = await refundEscrow(id);

  res.json(escrow);
});

module.exports = router;
