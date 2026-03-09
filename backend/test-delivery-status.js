require('dotenv').config();
const { getDeliveryStatus } = require('./models/deliveryModel');

async function testDeliveryStatus() {
  try {
    console.log('Testing getDeliveryStatus with orderId: 3');
    const status = await getDeliveryStatus(3);
    console.log('✅ Success:', JSON.stringify(status, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDeliveryStatus();
