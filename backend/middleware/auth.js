const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

// Verify JWT token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}

// Role-based authorization middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Access denied. Insufficient permissions" 
      });
    }
    next();
  };
}

// Optional authentication (doesn't fail if no token)
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
}

// Check if user owns the resource or is admin
function checkOwnershipOrAdmin(resourceUserIdField = "user_id") {
  return (req, res, next) => {
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // User can only access their own resources
    if (parseInt(resourceUserId) !== req.user.id) {
      return res.status(403).json({ 
        error: "Access denied. You can only access your own resources" 
      });
    }

    next();
  };
}

module.exports = {
  generateToken,
  authenticateToken,
  authorizeRoles,
  optionalAuth,
  checkOwnershipOrAdmin
};
