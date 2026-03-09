const { getEscrows, createEscrow, getEscrowById, releaseFunds, refundEscrow } = require("./models/escrowModel");

async function testDatabaseOnly() {
  try {
    console.log("🧪 Testing database operations only...\n");
    
    // Test 1: Get all escrows
    console.log("1️⃣ Getting all escrows:");
    const escrows = await getEscrows();
    console.log("✅ Found", escrows.length, "escrows");
    console.log("First escrow:", escrows[0]);
    
    // Test 2: Get escrow by ID
    console.log("\n2️⃣ Getting escrow by ID:");
    const escrow = await getEscrowById(1);
    console.log("✅ Escrow by ID:", escrow);
    
    // Test 3: Create new escrow
    console.log("\n3️⃣ Creating new escrow:");
    const newEscrow = await createEscrow("0xBuyer", "0xSeller", 1000);
    console.log("✅ Created escrow:", newEscrow);
    
    // Test 4: Update escrow status to completed
    console.log("\n4️⃣ Releasing funds (marking as completed):");
    const completed = await releaseFunds(newEscrow.id);
    console.log("✅ Updated escrow:", completed);
    
    // Test 5: Test refund
    console.log("\n5️⃣ Testing refund:");
    const refunded = await refundEscrow(newEscrow.id);
    console.log("✅ Refunded escrow:", refunded);
    
    console.log("\n🎉 All database operations working correctly!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testDatabaseOnly();
