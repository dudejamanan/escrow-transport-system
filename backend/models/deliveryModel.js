const pool = require("../config/db");

// Upload delivery proof
async function uploadDeliveryProof(orderId, driverId, imageUrl) {
  const result = await pool.query(
    "INSERT INTO delivery_proofs (order_id, driver_id, image_url) VALUES ($1, $2, $3) RETURNING *",
    [orderId, driverId, imageUrl]
  );
  
  return result.rows[0];
}

// Get delivery proofs by order ID
async function getDeliveryProofsByOrderId(orderId) {
  const result = await pool.query(`
    SELECT dp.*, u.name as driver_name, u.email as driver_email
    FROM delivery_proofs dp
    LEFT JOIN users u ON dp.driver_id = u.id
    WHERE dp.order_id = $1
    ORDER BY dp.uploaded_at DESC
  `, [orderId]);
  
  return result.rows;
}

// Get delivery proofs by driver ID
async function getDeliveryProofsByDriverId(driverId) {
  const result = await pool.query(`
    SELECT dp.*, o.pickup_location, o.drop_location, o.amount
    FROM delivery_proofs dp
    LEFT JOIN orders o ON dp.order_id = o.id
    WHERE dp.driver_id = $1
    ORDER BY dp.uploaded_at DESC
  `, [driverId]);
  
  return result.rows[0];
}

// Create delivery confirmation with OTP
async function createDeliveryConfirmation(orderId, driverId, confirmationMethod, confirmationCode) {
  const result = await pool.query(
    "INSERT INTO delivery_confirmations (order_id, driver_id, confirmation_method, confirmation_code, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [orderId, driverId, confirmationMethod, confirmationCode, false]
  );
  
  return result.rows[0];
}

// Verify delivery confirmation
async function verifyDeliveryConfirmation(orderId, confirmationCode) {
  const result = await pool.query(
    "UPDATE delivery_confirmations SET verified = TRUE, confirmed_at = CURRENT_TIMESTAMP WHERE order_id = $1 AND confirmation_code = $2 RETURNING *",
    [orderId, confirmationCode]
  );
  
  return result.rows[0];
}

// Get delivery confirmation by order ID
async function getDeliveryConfirmationByOrderId(orderId) {
  const result = await pool.query(`
    SELECT dc.*, u.name as driver_name, u.email as driver_email
    FROM delivery_confirmations dc
    LEFT JOIN users u ON dc.driver_id = u.id
    WHERE dc.order_id = $1
    ORDER BY dc.created_at DESC
    LIMIT 1
  `, [orderId]);
  
  return result.rows[0];
}

// Get all delivery confirmations for a driver
async function getDeliveryConfirmationsByDriverId(driverId) {
  const result = await pool.query(`
    SELECT dc.*, o.pickup_location, o.drop_location, o.amount
    FROM delivery_confirmations dc
    LEFT JOIN orders o ON dc.order_id = o.id
    WHERE dc.driver_id = $1
    ORDER BY dc.created_at DESC
  `, [driverId]);
  
  return result.rows;
}

// Check if delivery is confirmed
async function isDeliveryConfirmed(orderId) {
  const result = await pool.query(
    "SELECT verified FROM delivery_confirmations WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1",
    [orderId]
  );
  
  return result.rows[0]?.verified || false;
}

// Get delivery status (combines proofs and confirmations)
async function getDeliveryStatus(orderId) {
  const proofsResult = await pool.query(
    "SELECT COUNT(*) as proof_count FROM delivery_proofs WHERE order_id = $1",
    [orderId]
  );
  
  const confirmationResult = await pool.query(
    "SELECT verified, confirmation_method FROM delivery_confirmations WHERE order_id = $1 ORDER BY confirmed_at DESC LIMIT 1",
    [orderId]
  );
  
  const confirmation = confirmationResult.rows[0] || null;
  
  return {
    orderId,
    proofCount: parseInt(proofsResult.rows[0].proof_count),
    confirmation: confirmation,
    isConfirmed: confirmation ? (confirmation.verified === true || confirmation.verified === 'true') : false
  };
}

// Delete delivery proof (admin only)
async function deleteDeliveryProof(id) {
  const result = await pool.query(
    "DELETE FROM delivery_proofs WHERE id = $1 RETURNING id, order_id, driver_id",
    [id]
  );
  
  return result.rows[0];
}

// Delete delivery confirmation (admin only)
async function deleteDeliveryConfirmation(id) {
  const result = await pool.query(
    "DELETE FROM delivery_confirmations WHERE id = $1 RETURNING id, order_id, driver_id",
    [id]
  );
  
  return result.rows[0];
}

// Get delivery statistics
async function getDeliveryStats() {
  const result = await pool.query(`
    SELECT 
      dc.verification_method,
      COUNT(*) as count,
      COUNT(CASE WHEN dc.verified = TRUE THEN 1 END) as verified_count
    FROM delivery_confirmations dc
    GROUP BY dc.verification_method
    ORDER BY count DESC
  `);
  
  return result.rows;
}

module.exports = {
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
};
