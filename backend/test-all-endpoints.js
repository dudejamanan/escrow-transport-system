const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing all escrow API endpoints...\n');

  try {
    // Test 1: GET /api/escrow/test
    console.log('1️⃣ Testing GET /api/escrow/test');
    const testResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/escrow/test',
      method: 'GET'
    });
    console.log(`✅ Status: ${testResponse.statusCode}`);
    console.log(`Response: ${testResponse.body}\n`);

    // Test 2: GET /api/escrow/escrows
    console.log('2️⃣ Testing GET /api/escrow/escrows');
    const escrowsResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/escrow/escrows',
      method: 'GET'
    });
    console.log(`✅ Status: ${escrowsResponse.statusCode}`);
    console.log(`Response: ${escrowsResponse.body}\n`);

    // Test 3: GET /api/escrow/escrow/1
    console.log('3️⃣ Testing GET /api/escrow/escrow/1');
    const escrowResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/escrow/escrow/1',
      method: 'GET'
    });
    console.log(`✅ Status: ${escrowResponse.statusCode}`);
    console.log(`Response: ${escrowResponse.body}\n`);

    // Test 4: POST /api/escrow/createEscrow
    console.log('4️⃣ Testing POST /api/escrow/createEscrow');
    const createData = JSON.stringify({
      buyer_wallet: "0xBuyer",
      seller_wallet: "0xSeller",
      amount: 1500
    });
    const createResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/escrow/createEscrow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': createData.length
      }
    }, createData);
    console.log(`✅ Status: ${createResponse.statusCode}`);
    console.log(`Response: ${createResponse.body}\n`);

    // Parse the created escrow ID for next tests
    const createdEscrow = JSON.parse(createResponse.body);
    const escrowId = createdEscrow.escrow.id;

    // Test 5: POST /api/escrow/confirmDelivery/:id
    console.log(`5️⃣ Testing POST /api/escrow/confirmDelivery/${escrowId}`);
    const confirmResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/escrow/confirmDelivery/${escrowId}`,
      method: 'POST'
    });
    console.log(`✅ Status: ${confirmResponse.statusCode}`);
    console.log(`Response: ${confirmResponse.body}\n`);

    // Test 6: POST /api/escrow/refund/:id
    console.log(`6️⃣ Testing POST /api/escrow/refund/${escrowId}`);
    const refundResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/escrow/refund/${escrowId}`,
      method: 'POST'
    });
    console.log(`✅ Status: ${refundResponse.statusCode}`);
    console.log(`Response: ${refundResponse.body}\n`);

    console.log('🎉 All endpoint tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllEndpoints();
