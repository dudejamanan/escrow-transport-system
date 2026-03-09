require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkDeliverySchema() {
  try {
    console.log('📋 delivery_confirmations table schema:');
    const confirmationsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'delivery_confirmations'
      ORDER BY ordinal_position
    `);
    
    confirmationsResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    console.log('\n📋 delivery_proofs table schema:');
    const proofsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'delivery_proofs'
      ORDER BY ordinal_position
    `);
    
    proofsResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDeliverySchema();
