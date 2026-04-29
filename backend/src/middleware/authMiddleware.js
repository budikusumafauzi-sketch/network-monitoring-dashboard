const jwt = require("jsonwebtoken");
const User = require("../models/User");
const log = require("../utils/logger");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      console.log("AUTH HEADER:", req.headers.authorization);
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      next();
    } catch (error) {
      log.error("Not authorized, token failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      log.warn(
        `User ${req.user.username} with role ${req.user.role} tried to access restricted route.`,
      );
      return res
        .status(403)
        .json({
          message: `User role ${req.user.role} is not authorized to access this route`,
        });
    }
    next();
  };
};

module.exports = { protect, authorize };
