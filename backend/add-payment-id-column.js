require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function addPaymentIdColumn() {
  try {
    console.log('Adding payment_id column to escrow_transactions table...');
    
    // Add payment_id column
    await pool.query(`
      ALTER TABLE escrow_transactions 
      ADD COLUMN IF NOT EXISTS payment_id TEXT
    `);
    
    console.log('✅ payment_id column added successfully');
    
    await pool.end();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

addPaymentIdColumn();
