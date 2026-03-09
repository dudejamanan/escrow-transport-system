require('dotenv').config();
const { createRazorpayOrder } = require('./services/razorpayService');

async function testRazorpayDirectly() {
  try {
    console.log('🧪 Testing Razorpay Service Directly...\n');
    
    console.log('1️⃣ Testing createRazorpayOrder function...');
    const result = await createRazorpayOrder(2500);
    
    console.log('✅ Result:', JSON.stringify(result, null, 2));
    
    if (result && result.razorpay_order_id) {
      console.log('\n🎉 Razorpay service working correctly!');
    } else {
      console.log('\n❌ Razorpay service failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRazorpayDirectly();
