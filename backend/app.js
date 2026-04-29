const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./src/middleware/errorHandler");
const authRoutes = require("./src/routes/authRoutes");
const deviceRoutes = require("./src/routes/deviceRoutes");
const alertRoutes = require("./src/routes/alertRoutes");
const monitoringRoutes = require("./src/routes/monitoringRoutes");
const log = require("./src/utils/logger");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK 🚀" });
});

// Basic route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Network Monitoring Dashboard API" });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
