// Mock blockchain service for testing without a real blockchain node

async function createOrder(driverAddress, payment) {
  console.log(`🔗 Mock: Creating order for driver ${driverAddress} with payment ${payment}`);
  
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return mock transaction hash
  return "0xmocktx" + Math.random().toString(36).substr(2, 9);
}

async function confirmDelivery(orderId) {
  console.log(`🔗 Mock: Confirming delivery for order ${orderId}`);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return "0xmockconfirm" + Math.random().toString(36).substr(2, 9);
}

async function refundCustomer(orderId) {
  console.log(`🔗 Mock: Refunding customer for order ${orderId}`);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return "0xmockrefund" + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  createOrder,
  confirmDelivery,
  refundCustomer
};
