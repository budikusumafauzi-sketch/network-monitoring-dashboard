const cron = require('node-cron');
const ping = require('ping');
const Device = require('../models/Device');
const MonitoringLog = require('../models/MonitoringLog');
const Alert = require('../models/Alert');
const log = require('../utils/logger');
const { Op } = require('sequelize');

// Store device status and consecutive down counts
const deviceStatus = new Map(); // Map: deviceId -> { isUp: boolean, consecutiveDown: number }

const checkDevice = async (device) => {
  try {
    const res = await ping.promise.probe(device.ip_address);
    let status = res.alive ? 'up' : 'down';
    let latency = res.time !== 'unknown' ? res.time : null; // ping.promise.probe returns 'unknown' for dead hosts

    // Update device status map
    if (!deviceStatus.has(device.id)) {
      deviceStatus.set(device.id, { isUp: res.alive, consecutiveDown: res.alive ? 0 : 1 });
    } else {
      const currentStatus = deviceStatus.get(device.id);
      if (res.alive) {
        currentStatus.isUp = true;
        currentStatus.consecutiveDown = 0;
      } else {
        currentStatus.isUp = false;
        currentStatus.consecutiveDown++;
      }
      deviceStatus.set(device.id, currentStatus);
    }

    await MonitoringLog.create({
      device_id: device.id,
      latency: latency,
      status: status,
      // packet_loss: (ping library does not directly provide packet loss for single pings)
      timestamp: new Date(),
    });
    log.info(`Device ${device.name} (${device.ip_address}) is ${status}. Latency: ${latency}ms`);

    // Alert generation if device is down 3 consecutive times
    const currentStatus = deviceStatus.get(device.id);
    if (!currentStatus.isUp && currentStatus.consecutiveDown === 3) {
      const message = `Device ${device.name} (${device.ip_address}) has been down for 3 consecutive checks.`;
      await Alert.create({
        device_id: device.id,
        message: message,
        created_at: new Date(),
        resolved: false,
      });
      log.warn(`ALERT: ${message}`);
    }

  } catch (error) {
    log.error(`Error checking device ${device.name} (${device.ip_address}):`, error.message);
    await MonitoringLog.create({
      device_id: device.id,
      latency: null,
      status: 'down',
      timestamp: new Date(),
    });

    // Handle error as a 'down' status for alert purposes
    if (!deviceStatus.has(device.id)) {
      deviceStatus.set(device.id, { isUp: false, consecutiveDown: 1 });
    } else {
      const currentStatus = deviceStatus.get(device.id);
      currentStatus.isUp = false;
      currentStatus.consecutiveDown++;
      deviceStatus.set(device.id, currentStatus);
    }

    const currentStatus = deviceStatus.get(device.id);
    if (!currentStatus.isUp && currentStatus.consecutiveDown === 3) {
      const message = `Device ${device.name} (${device.ip_address}) encountered an error during check for 3 consecutive times.`;
      await Alert.create({
        device_id: device.id,
        message: message,
        created_at: new Date(),
        resolved: false,
      });
      log.warn(`ALERT: ${message}`);
    }
  }
};

const startMonitoring = () => {
  // Schedule to run every 5 seconds
  cron.schedule('*/5 * * * * *', async () => {
    log.debug('Running scheduled device monitoring...');
    try {
      const devices = await Device.findAll();
      for (const device of devices) {
        await checkDevice(device);
      }
    } catch (error) {
      log.error('Error in scheduled monitoring task:', error.message);
    }
  });
  log.info('Device monitoring service started. Checking devices every 5 seconds.');
};

module.exports = {
  startMonitoring,
  checkDevice,
};
