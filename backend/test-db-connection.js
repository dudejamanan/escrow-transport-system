require('dotenv').config();
const { Pool } = require('pg');

console.log('Environment variables:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[HIDDEN]' : 'UNDEFINED');
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Try connecting to default postgres database first
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    console.log('\nTesting connection to postgres database...');
    const client = await pool.connect();
    console.log('✓ Connected to postgres database');
    
    // Check if escrow_transport database exists
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [process.env.DB_NAME]);
    
    if (result.rows.length > 0) {
      console.log('✓ Database', process.env.DB_NAME, 'exists');
    } else {
      console.log('✗ Database', process.env.DB_NAME, 'does not exist');
      console.log('Creating database...');
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log('✓ Database created successfully');
    }
    
    client.release();
    
    // Now test connection to the actual database
    const targetPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    
    console.log('\nTesting connection to', process.env.DB_NAME, 'database...');
    const targetClient = await targetPool.connect();
    console.log('✓ Connected to', process.env.DB_NAME, 'database');
    targetClient.release();
    
    await pool.end();
    await targetPool.end();
    
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
