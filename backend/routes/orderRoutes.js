const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles, checkOwnershipOrAdmin } = require("../middleware/auth");
const {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByDriverId,
  updateOrderStatus,
  updateOrder,
  assignDriver,
  getOrdersByStatus,
  getAvailableOrders,
  deleteOrder,
  getOrderStats
} = require("../models/orderModel");

// Create new order (customer only)
router.post("/", authenticateToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { driverId, pickupLocation, dropLocation, amount } = req.body;

    // Validation
    if (!pickupLocation || !dropLocation || !amount) {
      return res.status(400).json({ 
        error: "Pickup location, drop location, and amount are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Create order with current user as customer
    const order = await createOrder(
      req.user.id,
      driverId || null,
      pickupLocation,
      dropLocation,
      amount
    );

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all orders (admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await getAllOrders();
    
    res.json({
      message: "Orders retrieved successfully",
      orders
    });

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user's orders (customer/driver)
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === "customer") {
      orders = await getOrdersByCustomerId(req.user.id);
    } else if (req.user.role === "driver") {
      orders = await getOrdersByDriverId(req.user.id);
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.json({
      message: "Orders retrieved successfully",
      orders
    });

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get available orders (for drivers to accept)
router.get("/available", authenticateToken, authorizeRoles("driver"), async (req, res) => {
  try {
    const orders = await getAvailableOrders();
    
    res.json({
      message: "Available orders retrieved successfully",
      orders
    });

  } catch (error) {
    console.error("Get available orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get orders by status (admin only)
router.get("/status/:status", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["CREATED", "IN_TRANSIT", "DELIVERED", "COMPLETED", "CANCELLED"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const orders = await getOrdersByStatus(status);
    
    res.json({
      message: `Orders with status '${status}' retrieved successfully`,
      orders
    });

  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get order by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user has permission to view this order
    if (req.user.role !== "admin" && 
        order.customer_id !== req.user.id && 
        order.driver_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.json({
      message: "Order retrieved successfully",
      order
    });

  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Accept order (driver only)
router.post("/:id/accept", authenticateToken, authorizeRoles("driver"), async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if order exists and is available
    const order = await getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "CREATED" || order.driver_id !== null) {
      return res.status(400).json({ error: "Order is not available for acceptance" });
    }

    // Assign driver to order
    const updatedOrder = await assignDriver(id, req.user.id);
    
    res.json({
      message: "Order accepted successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Accept order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update order status (admin only)
router.put("/:id/status", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ["CREATED", "IN_TRANSIT", "DELIVERED", "COMPLETED", "CANCELLED"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const updatedOrder = await updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({
      message: "Order status updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update order details (customer only, only if order is CREATED)
router.put("/:id", authenticateToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { id } = req.params;
    const { pickupLocation, dropLocation, amount } = req.body;

    // Check if order exists and belongs to current user
    const order = await getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.customer_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (order.status !== "CREATED") {
      return res.status(400).json({ 
        error: "Order can only be updated if status is CREATED" 
      });
    }

    // Validation
    if (!pickupLocation || !dropLocation || !amount) {
      return res.status(400).json({ 
        error: "Pickup location, drop location, and amount are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const updatedOrder = await updateOrder(id, pickupLocation, dropLocation, amount);
    
    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete order (admin only or customer if order is CREATED)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if order exists
    const order = await getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permissions
    if (req.user.role !== "admin") {
      if (order.customer_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      if (order.status !== "CREATED") {
        return res.status(400).json({ 
          error: "Order can only be deleted if status is CREATED" 
        });
      }
    }

    const deletedOrder = await deleteOrder(id);
    
    res.json({
      message: "Order deleted successfully",
      order: deletedOrder
    });

  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get order statistics (admin only)
router.get("/stats/summary", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const stats = await getOrderStats();
    
    res.json({
      message: "Order statistics retrieved successfully",
      stats
    });

  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
