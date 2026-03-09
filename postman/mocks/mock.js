const http = require("http");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // @endpoint GET /test-db
  if (method === "GET" && url === "/test-db") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Database connection successful" }));
    return;
  }

  // @endpoint GET /api/escrow/escrows
  if (method === "GET" && url === "/api/escrow/escrows") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([
      { id: 1, buyer_wallet: "0xBuyer1", seller_wallet: "0xSeller1", amount: 500, status: "pending" },
      { id: 2, buyer_wallet: "0xBuyer2", seller_wallet: "0xSeller2", amount: 1000, status: "completed" }
    ]));
    return;
  }

  // @endpoint POST /api/escrow/createEscrow
  if (method === "POST" && url === "/api/escrow/createEscrow") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.buyer_wallet || !data.seller_wallet || data.amount === undefined) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required fields" }));
          return;
        }
        if (data.amount < 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Amount must be positive" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          id: Math.floor(Math.random() * 10000),
          buyer_wallet: data.buyer_wallet,
          seller_wallet: data.seller_wallet,
          amount: data.amount,
          status: "pending"
        }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // @endpoint GET /api/escrow/escrow/:id
  if (method === "GET" && url.match(/^\/api\/escrow\/escrow\/\d+$/)) {
    const id = url.split("/").pop();
    if (id === "999999") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Escrow not found" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      id: parseInt(id),
      buyer_wallet: "0xBuyerWalletAddress123",
      seller_wallet: "0xSellerWalletAddress456",
      amount: 1000,
      status: "pending"
    }));
    return;
  }

  // @endpoint POST /api/escrow/releaseFunds/:id
  if (method === "POST" && url.match(/^\/api\/escrow\/releaseFunds\/\d+$/)) {
    const id = url.split("/").pop();
    if (id === "999999") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Escrow not found" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      id: parseInt(id),
      buyer_wallet: "0xBuyerWalletAddress123",
      seller_wallet: "0xSellerWalletAddress456",
      amount: 1000,
      status: "completed"
    }));
    return;
  }

  // @endpoint POST /api/escrow/refund/:id
  if (method === "POST" && url.match(/^\/api\/escrow\/refund\/\d+$/)) {
    const id = url.split("/").pop();
    if (id === "999999") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Escrow not found" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      id: parseInt(id),
      buyer_wallet: "0xBuyerWalletAddress123",
      seller_wallet: "0xSellerWalletAddress456",
      amount: 1000,
      status: "refunded"
    }));
    return;
  }

  // 404 fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Mock server running on port " + (process.env.PORT || 3000));
});
