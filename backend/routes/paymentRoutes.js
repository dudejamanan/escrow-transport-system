const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { createRazorpayOrder, verifyPaymentSignature, getPaymentDetails } = require("../services/razorpayService");
const { createOrder } = require("../services/mockBlockchainService"); // Using mock for now
const { createEscrow } = require("../models/escrowModel");

// Create Razorpay order
router.post("/create-order", authenticateToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: "Valid amount is required" 
      });
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(amount);

    res.json({
      message: "Payment order created successfully",
      order: razorpayOrder
    });

  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ 
      error: "Failed to create payment order",
      details: error.message 
    });
  }
});

// Verify payment and create escrow
router.post("/verify", authenticateToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, seller_wallet, amount } = req.body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: "All payment details are required" 
      });
    }

    if (!seller_wallet || !amount) {
      return res.status(400).json({ 
        error: "Seller wallet and amount are required" 
      });
    }

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    
    if (!isValidSignature) {
      return res.status(400).json({ 
        error: "Invalid payment signature" 
      });
    }

    // Get payment details to confirm payment status
    const paymentDetails = await getPaymentDetails(razorpay_payment_id);
    
    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({ 
        error: "Payment not successful" 
      });
    }

    // 1️⃣ Call existing blockchain escrow creation logic
    const txHash = await createOrder(seller_wallet, amount);

    // 2️⃣ Store escrow record in database with payment details
    const escrow = await createEscrow(
      req.user.email, // buyer identifier
      seller_wallet,
      amount,
      razorpay_payment_id, // payment_id
      txHash // transaction_hash
    );

    res.json({
      message: "Payment verified and escrow created successfully",
      escrow,
      payment: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: paymentDetails.amount / 100, // Convert from paise to INR
        status: paymentDetails.status,
        method: "razorpay"
      },
      blockchain_transaction: txHash
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// Get payment status
router.get("/status/:paymentId", authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ 
        error: "Payment ID is required" 
      });
    }

    const paymentDetails = await getPaymentDetails(paymentId);

    res.json({
      message: "Payment status retrieved successfully",
      payment: {
        id: paymentDetails.id,
        amount: paymentDetails.amount / 100, // Convert from paise to INR
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        method: paymentDetails.method,
        created_at: paymentDetails.created_at
      }
    });

  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
});

module.exports = router;
