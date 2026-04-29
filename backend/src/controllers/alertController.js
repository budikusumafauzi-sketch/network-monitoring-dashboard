const Alert = require('../models/Alert');
const Device = require('../models/Device');
const log = require('../utils/logger');

// @desc    Get all alerts for the user's devices
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    // Find all devices owned by the current user
    const userDevices = await Device.findAll({
      where: { userId: req.user.id },
      attributes: ['id'], // Only fetch device IDs
    });

    const deviceIds = userDevices.map(device => device.id);

    const alerts = await Alert.findAll({
      where: { device_id: deviceIds },
      include: [{ model: Device, as: 'device', attributes: ['name', 'ip_address'] }],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(alerts);
  } catch (error) {
    log.error('Error fetching alerts:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAlerts,
};
