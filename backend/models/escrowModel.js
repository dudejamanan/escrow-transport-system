const pool = require("../config/db");

async function getEscrows() {
    const result = await pool.query("SELECT * FROM escrow_transactions");
    return result.rows;
}

async function createEscrow(buyer, seller, amount, paymentId = null, transactionHash = null) {
  const result = await pool.query(
    "INSERT INTO escrow_transactions (order_id, contract_address, tx_hash, amount, status, payment_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [1, "0xcontract123", transactionHash || "0xtx123", amount, "LOCKED", paymentId]
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

async function releaseFunds(id) {

  const result = await pool.query(
    "UPDATE escrow_transactions SET status=$1 WHERE id=$2 RETURNING *",
    ["RELEASED", id]
  );

  return result.rows[0];
}

async function refundEscrow(id) {
  const result = await pool.query(
    "UPDATE escrow_transactions SET status=$1 WHERE id=$2 RETURNING *",
    ["REFUNDED", id]
  );

  return result.rows[0];
}

module.exports = { getEscrows, createEscrow, getEscrowById, releaseFunds, refundEscrow };
