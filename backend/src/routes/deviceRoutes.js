const express = require("express");
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceMonitoringHistory,
  getDeviceStatistics,
} = require("../controllers/deviceController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validateDevice } = require("../middleware/validationMiddleware");

const router = express.Router();

router.route("/").get(getDevices).post(protect, validateDevice, createDevice);

router
  .route("/:id")
  .get(protect, getDeviceById)
  .put(protect, validateDevice, updateDevice)
  .delete(protect, authorize("admin"), deleteDevice); // Only admin can delete

router.get("/:id/history", protect, getDeviceMonitoringHistory);
router.get("/:id/statistics", protect, getDeviceStatistics);

module.exports = router;
