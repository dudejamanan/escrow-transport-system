const http = require('http');

const data = JSON.stringify({
  buyer_wallet: "0xBuyer",
  seller_wallet: "0xSeller", 
  amount: 1000
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/escrow/createEscrow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
