const express = require("express");
const pool = require("./config/db");
const escrowRoutes = require("./routes/escrowRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json({
      message: "Database connected successfully",
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Escrow routes
app.use("/api/escrow", escrowRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Starting Express server...");
setInterval(() => {
  console.log("Server heartbeat 💓");
}, 5000);