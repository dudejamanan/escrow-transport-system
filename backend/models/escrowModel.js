const pool = require("../config/db");

async function getEscrows() {
    const result = await pool.query("SELECT * FROM escrow_transactions");
    return result.rows;
}

async function createEscrow(orderId, contractAddress, txHash, amount, paymentId = null) {

  const result = await pool.query(
    `INSERT INTO escrow_transactions 
     (order_id, contract_address, tx_hash, amount, status, payment_id)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      orderId,
      contractAddress,
      txHash,
      amount,
      "LOCKED",
      paymentId
    ]
  );

  return result.rows[0];
}

async function getEscrowById(id) {

  const result = await pool.query(
    "SELECT * FROM escrow_transactions WHERE id=$1",
    [id]
  );

  return result.rows[0];

}

async function releaseFunds(orderId) {

  const result = await pool.query(
    "UPDATE escrow_transactions SET status=$1 WHERE order_id=$2 RETURNING *",
    ["RELEASED", orderId]
  );

  return result.rows[0];

}

async function refundEscrow(orderId) {

  const result = await pool.query(
    "UPDATE escrow_transactions SET status=$1 WHERE order_id=$2 RETURNING *",
    ["REFUNDED", orderId]
  );

  return result.rows[0];

}

module.exports = {
  getEscrows,
  createEscrow,
  getEscrowById,
  releaseFunds,
  refundEscrow
};