const express = require("express");
const cors = require("cors");

const escrowRoutes = require("./routes/escrowRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", escrowRoutes);

app.get("/", (req, res) => {
  res.send("Escrow Backend Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});