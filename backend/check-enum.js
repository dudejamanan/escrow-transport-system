require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkEnum() {
  try {
    const result = await pool.query(`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'escrow_status_enum'
      )
      ORDER BY enumsortorder
    `);
    
    console.log('🏷️ Valid escrow status values:');
    result.rows.forEach(row => {
      console.log(`- ${row.enumlabel}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkEnum();
