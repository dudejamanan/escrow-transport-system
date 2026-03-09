require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function addPasswordColumn() {
  try {
    console.log('Adding password column to users table...');
    
    // Add password column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT ''
    `);
    
    console.log('✅ Password column added successfully');
    
    // Check if we need to update existing users
    const result = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE password = '' OR password IS NULL
    `);
    
    const usersWithoutPassword = parseInt(result.rows[0].count);
    console.log(`Found ${usersWithoutPassword} users without password`);
    
    if (usersWithoutPassword > 0) {
      console.log('Setting default passwords for existing users...');
      await pool.query(`
        UPDATE users 
        SET password = '$2a$10$default.password.hash.for.testing' 
        WHERE password = '' OR password IS NULL
      `);
      console.log('✅ Default passwords set for existing users');
    }
    
    await pool.end();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

addPasswordColumn();
