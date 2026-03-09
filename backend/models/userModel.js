const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Create new user
async function createUser(name, email, password, role, walletAddress = null) {
  const hashedPassword = await hashPassword(password);
  
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role, wallet_address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, wallet_address, created_at",
    [name, email, hashedPassword, role, walletAddress]
  );
  
  return result.rows[0];
}

// Find user by email
async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  
  return result.rows[0];
}

// Find user by ID
async function findUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email, role, wallet_address, created_at FROM users WHERE id = $1",
    [id]
  );
  
  return result.rows[0];
}

// Update user profile
async function updateUser(id, name, walletAddress = null) {
  const result = await pool.query(
    "UPDATE users SET name = $1, wallet_address = $2 WHERE id = $3 RETURNING id, name, email, role, wallet_address, created_at",
    [name, walletAddress, id]
  );
  
  return result.rows[0];
}

// Get all users (admin only)
async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, name, email, role, wallet_address, created_at FROM users ORDER BY created_at DESC"
  );
  
  return result.rows;
}

// Get users by role
async function getUsersByRole(role) {
  const result = await pool.query(
    "SELECT id, name, email, role, wallet_address, created_at FROM users WHERE role = $1 ORDER BY created_at DESC",
    [role]
  );
  
  return result.rows;
}

// Delete user (admin only)
async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
    [id]
  );
  
  return result.rows[0];
}

// Verify user credentials (for login)
async function verifyUser(email, password) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsers,
  getUsersByRole,
  deleteUser,
  verifyUser
};
