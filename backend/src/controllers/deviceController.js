// ✅ GET ALL DEVICES
const getDevices = async (req, res) => {
  res.json([
    { id: 1, name: "Router", status: "online" },
    { id: 2, name: "Switch", status: "offline" },
    { id: 3, name: "Server", status: "online" }
  ]);
};

// ✅ GET DEVICE BY ID
const getDeviceById = async (req, res) => {
  res.json({ id: req.params.id, name: "Router", status: "online" });
};

// ✅ CREATE DEVICE
const createDevice = async (req, res) => {
  res.json({ message: "Device created" });
};

// ✅ UPDATE DEVICE
const updateDevice = async (req, res) => {
  res.json({ message: "Device updated" });
};

// ✅ DELETE DEVICE
const deleteDevice = async (req, res) => {
  res.json({ message: "Device deleted" });
};

// ✅ HISTORY
const getDeviceMonitoringHistory = async (req, res) => {
  res.json({ message: "Device history" });
};

// ✅ STATISTICS
const getDeviceStatistics = async (req, res) => {
  res.json({ message: "Device statistics" });
};

// ✅ EXPORT SEMUA
module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceMonitoringHistory,
  getDeviceStatistics,
};