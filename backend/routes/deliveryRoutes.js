const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  uploadDeliveryProof,
  getDeliveryProofsByOrderId,
  getDeliveryProofsByDriverId,
  createDeliveryConfirmation,
  verifyDeliveryConfirmation,
  getDeliveryConfirmationByOrderId,
  getDeliveryConfirmationsByDriverId,
  isDeliveryConfirmed,
  getDeliveryStatus,
  deleteDeliveryProof,
  deleteDeliveryConfirmation,
  getDeliveryStats
} = require("../models/deliveryModel");

// Upload delivery proof (driver only)
router.post("/proofs", authenticateToken, authorizeRoles("driver"), async (req, res) => {
  try {
    const { orderId, imageUrl } = req.body;

    // Validation
    if (!orderId || !imageUrl) {
      return res.status(400).json({ 
        error: "Order ID and image URL are required" 
      });
    }

    // Upload delivery proof
    const proof = await uploadDeliveryProof(orderId, req.user.id, imageUrl);
    
    res.status(201).json({
      message: "Delivery proof uploaded successfully",
      proof
    });

  } catch (error) {
    console.error("Upload delivery proof error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery proofs by order ID
router.get("/proofs/order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const proofs = await getDeliveryProofsByOrderId(orderId);
    
    res.json({
      message: "Delivery proofs retrieved successfully",
      proofs
    });

  } catch (error) {
    console.error("Get delivery proofs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery proofs by driver ID
router.get("/proofs/driver/:driverId", authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Check permissions (admin or own proofs)
    if (req.user.role !== "admin" && parseInt(driverId) !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const proofs = await getDeliveryProofsByDriverId(driverId);
    
    res.json({
      message: "Driver delivery proofs retrieved successfully",
      proofs
    });

  } catch (error) {
    console.error("Get driver delivery proofs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create delivery confirmation with OTP (driver only)
router.post("/confirmations", authenticateToken, authorizeRoles("driver"), async (req, res) => {
  try {
    const { orderId, confirmationMethod, confirmationCode } = req.body;

    // Validation
    if (!orderId || !confirmationMethod || !confirmationCode) {
      return res.status(400).json({ 
        error: "Order ID, confirmation method, and confirmation code are required" 
      });
    }

    const validMethods = ["OTP", "QR", "SIGNATURE", "PHOTO"];
    if (!validMethods.includes(confirmationMethod)) {
      return res.status(400).json({ 
        error: `Confirmation method must be one of: ${validMethods.join(", ")}` 
      });
    }

    // Create delivery confirmation
    const confirmation = await createDeliveryConfirmation(
      orderId, 
      req.user.id, 
      confirmationMethod, 
      confirmationCode
    );
    
    res.status(201).json({
      message: "Delivery confirmation created successfully",
      confirmation
    });

  } catch (error) {
    console.error("Create delivery confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify delivery confirmation (customer only)
router.post("/confirmations/verify", authenticateToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { orderId, confirmationCode } = req.body;

    // Validation
    if (!orderId || !confirmationCode) {
      return res.status(400).json({ 
        error: "Order ID and confirmation code are required" 
      });
    }

    // Verify delivery confirmation
    const verification = await verifyDeliveryConfirmation(orderId, confirmationCode);
    
    if (!verification) {
      return res.status(400).json({ error: "Invalid confirmation code" });
    }
    
    res.json({
      message: "Delivery confirmed successfully",
      verification
    });

  } catch (error) {
    console.error("Verify delivery confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery confirmation by order ID
router.get("/confirmations/order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const confirmation = await getDeliveryConfirmationByOrderId(orderId);
    
    res.json({
      message: "Delivery confirmation retrieved successfully",
      confirmation
    });

  } catch (error) {
    console.error("Get delivery confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery confirmations by driver ID
router.get("/confirmations/driver/:driverId", authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Check permissions (admin or own confirmations)
    if (req.user.role !== "admin" && parseInt(driverId) !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const confirmations = await getDeliveryConfirmationsByDriverId(driverId);
    
    res.json({
      message: "Driver delivery confirmations retrieved successfully",
      confirmations
    });

  } catch (error) {
    console.error("Get driver delivery confirmations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery status by order ID
router.get("/status/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const status = await getDeliveryStatus(orderId);
    
    res.json({
      message: "Delivery status retrieved successfully",
      status
    });

  } catch (error) {
    console.error("Get delivery status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if delivery is confirmed
router.get("/confirmed/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const isConfirmed = await isDeliveryConfirmed(orderId);
    
    res.json({
      message: "Delivery confirmation status retrieved successfully",
      orderId,
      isConfirmed
    });

  } catch (error) {
    console.error("Check delivery confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete delivery proof (admin only)
router.delete("/proofs/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProof = await deleteDeliveryProof(id);
    
    if (!deletedProof) {
      return res.status(404).json({ error: "Delivery proof not found" });
    }
    
    res.json({
      message: "Delivery proof deleted successfully",
      proof: deletedProof
    });

  } catch (error) {
    console.error("Delete delivery proof error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete delivery confirmation (admin only)
router.delete("/confirmations/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConfirmation = await deleteDeliveryConfirmation(id);
    
    if (!deletedConfirmation) {
      return res.status(404).json({ error: "Delivery confirmation not found" });
    }
    
    res.json({
      message: "Delivery confirmation deleted successfully",
      confirmation: deletedConfirmation
    });

  } catch (error) {
    console.error("Delete delivery confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get delivery statistics (admin only)
router.get("/stats/summary", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const stats = await getDeliveryStats();
    
    res.json({
      message: "Delivery statistics retrieved successfully",
      stats
    });

  } catch (error) {
    console.error("Get delivery stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
