const express = require('express');
const { protect } = require('../middleware/authMiddleware');
// You can add controllers for global monitoring data here if needed.

const router = express.Router();

// Example: Get global monitoring status (not yet implemented in controller)
// router.get('/status', protect, getGlobalMonitoringStatus);

module.exports = router;
