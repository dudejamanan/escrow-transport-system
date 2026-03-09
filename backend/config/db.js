const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "escrow_db",
  password: "backend123",
  port: 5432,
});

module.exports = pool;
