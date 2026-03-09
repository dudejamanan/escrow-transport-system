const pool = require("../config/db");

// Create new order
async function createOrder(customerId, driverId, pickupLocation, dropLocation, amount) {
  const result = await pool.query(
    "INSERT INTO orders (customer_id, driver_id, pickup_location, drop_location, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [customerId, driverId, pickupLocation, dropLocation, amount, "CREATED"]
  );
  
  return result.rows[0];
}

// Get order by ID
async function getOrderById(id) {
  const result = await pool.query(`
    SELECT o.*, 
           c.name as customer_name, c.email as customer_email,
           d.name as driver_name, d.email as driver_email
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.id
    LEFT JOIN users d ON o.driver_id = d.id
    WHERE o.id = $1
  `, [id]);
  
  return result.rows[0];
}

// Get all orders
async function getAllOrders() {
  const result = await pool.query(`
    SELECT o.*, 
           c.name as customer_name, c.email as customer_email,
           d.name as driver_name, d.email as driver_email
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.id
    LEFT JOIN users d ON o.driver_id = d.id
    ORDER BY o.created_at DESC
  `);
  
  return result.rows;
}

// Get orders by customer ID
async function getOrdersByCustomerId(customerId) {
  const result = await pool.query(`
    SELECT o.*, 
           d.name as driver_name, d.email as driver_email
    FROM orders o
    LEFT JOIN users d ON o.driver_id = d.id
    WHERE o.customer_id = $1
    ORDER BY o.created_at DESC
  `, [customerId]);
  
  return result.rows;
}

// Get orders by driver ID
async function getOrdersByDriverId(driverId) {
  const result = await pool.query(`
    SELECT o.*, 
           c.name as customer_name, c.email as customer_email
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.id
    WHERE o.driver_id = $1
    ORDER BY o.created_at DESC
  `, [driverId]);
  
  return result.rows;
}

// Update order status
async function updateOrderStatus(id, status) {
  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  
  return result.rows[0];
}

// Update order details
async function updateOrder(id, pickupLocation, dropLocation, amount) {
  const result = await pool.query(
    "UPDATE orders SET pickup_location = $1, drop_location = $2, amount = $3 WHERE id = $4 RETURNING *",
    [pickupLocation, dropLocation, amount, id]
  );
  
  return result.rows[0];
}

// Assign driver to order
async function assignDriver(orderId, driverId) {
  const result = await pool.query(
    "UPDATE orders SET driver_id = $1, status = $2 WHERE id = $3 RETURNING *",
    [driverId, "IN_TRANSIT", orderId]
  );
  
  return result.rows[0];
}

// Get orders by status
async function getOrdersByStatus(status) {
  const result = await pool.query(`
    SELECT o.*, 
           c.name as customer_name, c.email as customer_email,
           d.name as driver_name, d.email as driver_email
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.id
    LEFT JOIN users d ON o.driver_id = d.id
    WHERE o.status = $1
    ORDER BY o.created_at DESC
  `, [status]);
  
  return result.rows;
}

// Get available orders (for drivers to accept)
async function getAvailableOrders() {
  const result = await pool.query(`
    SELECT o.*, 
           c.name as customer_name, c.email as customer_email
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.id
    WHERE o.status = 'CREATED' AND o.driver_id IS NULL
    ORDER BY o.created_at DESC
  `);
  
  return result.rows;
}

// Delete order (admin only)
async function deleteOrder(id) {
  const result = await pool.query(
    "DELETE FROM orders WHERE id = $1 RETURNING id, customer_id, driver_id",
    [id]
  );
  
  return result.rows[0];
}

// Get order statistics
async function getOrderStats() {
  const result = await pool.query(`
    SELECT 
      status,
      COUNT(*) as count,
      SUM(amount) as total_amount
    FROM orders 
    GROUP BY status
    ORDER BY count DESC
  `);
  
  return result.rows;
}

module.exports = {
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
};
