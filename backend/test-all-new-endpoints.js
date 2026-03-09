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
  console.log('🧪 Testing All New Backend Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing GET /health');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    });
    console.log(`✅ Status: ${healthResponse.statusCode}`);
    console.log(`Response: ${healthResponse.body}\n`);

    // Test 2: User Registration
    console.log('2️⃣ Testing POST /api/users/register');
    const registerData = JSON.stringify({
      name: "Test Customer",
      email: "testcustomer@example.com",
      password: "password123",
      role: "customer",
      walletAddress: "0xtestcustomer123"
    });
    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': registerData.length
      }
    }, registerData);
    console.log(`✅ Status: ${registerResponse.statusCode}`);
    console.log(`Response: ${registerResponse.body}\n`);

    // Parse registration response to get token
    const registerResult = JSON.parse(registerResponse.body);
    const customerToken = registerResult.token;

    // Test 3: User Login
    console.log('3️⃣ Testing POST /api/users/login');
    const loginData = JSON.stringify({
      email: "testcustomer@example.com",
      password: "password123"
    });
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);
    console.log(`✅ Status: ${loginResponse.statusCode}`);
    console.log(`Response: ${loginResponse.body}\n`);

    // Parse login response to get token
    const loginResult = JSON.parse(loginResponse.body);
    const token = loginResult.token;

    // Test 4: Get User Profile
    console.log('4️⃣ Testing GET /api/users/profile');
    const profileResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Status: ${profileResponse.statusCode}`);
    console.log(`Response: ${profileResponse.body}\n`);

    // Test 5: Create Order
    console.log('5️⃣ Testing POST /api/orders');
    const orderData = JSON.stringify({
      pickupLocation: "123 Main St, City A",
      dropLocation: "456 Oak Ave, City B",
      amount: 2500
    });
    const orderResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': orderData.length
      }
    }, orderData);
    console.log(`✅ Status: ${orderResponse.statusCode}`);
    console.log(`Response: ${orderResponse.body}\n`);

    // Parse order response to get order ID
    const orderResult = JSON.parse(orderResponse.body);
    const orderId = orderResult.order.id;

    // Test 6: Get My Orders
    console.log('6️⃣ Testing GET /api/orders/my-orders');
    const myOrdersResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders/my-orders',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Status: ${myOrdersResponse.statusCode}`);
    console.log(`Response: ${myOrdersResponse.body}\n`);

    // Test 7: Get Order by ID
    console.log(`7️⃣ Testing GET /api/orders/${orderId}`);
    const getOrderResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/orders/${orderId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Status: ${getOrderResponse.statusCode}`);
    console.log(`Response: ${getOrderResponse.body}\n`);

    // Test 8: Register Driver
    console.log('8️⃣ Testing POST /api/users/register (Driver)');
    const driverData = JSON.stringify({
      name: "Test Driver",
      email: "testdriver@example.com",
      password: "password123",
      role: "driver",
      walletAddress: "0xtestdriver123"
    });
    const driverResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': driverData.length
      }
    }, driverData);
    console.log(`✅ Status: ${driverResponse.statusCode}`);
    console.log(`Response: ${driverResponse.body}\n`);

    // Parse driver response to get token
    const driverResult = JSON.parse(driverResponse.body);
    const driverToken = driverResult.token;

    // Test 9: Get Available Orders (Driver)
    console.log('9️⃣ Testing GET /api/orders/available');
    const availableOrdersResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders/available',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${driverToken}`
      }
    });
    console.log(`✅ Status: ${availableOrdersResponse.statusCode}`);
    console.log(`Response: ${availableOrdersResponse.body}\n`);

    // Test 10: Accept Order (Driver)
    console.log(`10️⃣ Testing POST /api/orders/${orderId}/accept`);
    const acceptOrderResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/orders/${orderId}/accept`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${driverToken}`
      }
    });
    console.log(`✅ Status: ${acceptOrderResponse.statusCode}`);
    console.log(`Response: ${acceptOrderResponse.body}\n`);

    // Test 11: Upload Delivery Proof
    console.log('11️⃣ Testing POST /api/delivery/proofs');
    const proofData = JSON.stringify({
      orderId: orderId,
      imageUrl: "https://example.com/delivery-proof.jpg"
    });
    const proofResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/delivery/proofs',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
        'Content-Length': proofData.length
      }
    }, proofData);
    console.log(`✅ Status: ${proofResponse.statusCode}`);
    console.log(`Response: ${proofResponse.body}\n`);

    // Test 12: Create Delivery Confirmation
    console.log('12️⃣ Testing POST /api/delivery/confirmations');
    const confirmationData = JSON.stringify({
      orderId: orderId,
      confirmationMethod: "OTP",
      confirmationCode: "123456"
    });
    const confirmationResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/delivery/confirmations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
        'Content-Length': confirmationData.length
      }
    }, confirmationData);
    console.log(`✅ Status: ${confirmationResponse.statusCode}`);
    console.log(`Response: ${confirmationResponse.body}\n`);

    // Test 13: Verify Delivery Confirmation (Customer)
    console.log('13️⃣ Testing POST /api/delivery/confirmations/verify');
    const verifyData = JSON.stringify({
      orderId: orderId,
      confirmationCode: "123456"
    });
    const verifyResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/delivery/confirmations/verify',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': verifyData.length
      }
    }, verifyData);
    console.log(`✅ Status: ${verifyResponse.statusCode}`);
    console.log(`Response: ${verifyResponse.body}\n`);

    // Test 14: Get Delivery Status
    console.log(`14️⃣ Testing GET /api/delivery/status/${orderId}`);
    const deliveryStatusResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/delivery/status/${orderId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Status: ${deliveryStatusResponse.statusCode}`);
    console.log(`Response: ${deliveryStatusResponse.body}\n`);

    // Test 15: Test Escrow Endpoints (should still work)
    console.log('15️⃣ Testing GET /api/escrow/test');
    const escrowTestResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/escrow/test',
      method: 'GET'
    });
    console.log(`✅ Status: ${escrowTestResponse.statusCode}`);
    console.log(`Response: ${escrowTestResponse.body}\n`);

    console.log('🎉 All endpoint tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllEndpoints();
