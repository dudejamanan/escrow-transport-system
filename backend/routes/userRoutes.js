const express = require("express");
const router = express.Router();
const { generateToken, authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsers,
  getUsersByRole,
  deleteUser,
  verifyUser
} = require("../models/userModel");

// Input validation helper
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, walletAddress } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: "Name, email, password, and role are required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    if (!["customer", "driver", "admin"].includes(role)) {
      return res.status(400).json({ 
        error: "Role must be customer, driver, or admin" 
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Create user
    const user = await createUser(name, email, password, role, walletAddress);
    
    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet_address: user.wallet_address,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Verify user credentials
    const user = await verifyUser(email, password);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet_address: user.wallet_address,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile retrieved successfully",
      user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedUser = await updateUser(req.user.id, name, walletAddress);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users (admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await getAllUsers();
    
    res.json({
      message: "Users retrieved successfully",
      users
    });

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get users by role (admin only)
router.get("/role/:role", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.params;

    if (!["customer", "driver", "admin"].includes(role)) {
      return res.status(400).json({ 
        error: "Role must be customer, driver, or admin" 
      });
    }

    const users = await getUsersByRole(role);
    
    res.json({
      message: `Users with role '${role}' retrieved successfully`,
      users
    });

  } catch (error) {
    console.error("Get users by role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID (admin only)
router.get("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User retrieved successfully",
      user
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: deletedUser
    });

  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
