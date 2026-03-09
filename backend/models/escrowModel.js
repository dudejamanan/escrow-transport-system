const pool = require("../config/db");

async function getEscrows() {
    const result = await pool.query("SELECT * FROM escrows");
    return result.rows;
}

async function createEscrow(buyer, seller, amount) {
  const result = await pool.query(
    "INSERT INTO escrows (buyer_wallet, seller_wallet, amount, status) VALUES ($1,$2,$3,$4) RETURNING *",
    [buyer, seller, amount, "pending"]
  );

  return result.rows[0];
}

async function getEscrowById(id) {
  const result = await pool.query(
    "SELECT * FROM escrows WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

async function releaseFunds(id) {

  const result = await pool.query(
    "UPDATE escrows SET status=$1 WHERE id=$2 RETURNING *",
    ["completed", id]
  );

  return result.rows[0];
}

async function refundEscrow(id) {
  const result = await pool.query(
    "UPDATE escrows SET status=$1 WHERE id=$2 RETURNING *",
    ["refunded", id]
  );

  return result.rows[0];
}

module.exports = { getEscrows, createEscrow, getEscrowById, releaseFunds, refundEscrow };
