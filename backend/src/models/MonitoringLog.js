const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Device = require('./Device');

const MonitoringLog = sequelize.define('MonitoringLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  device_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Device,
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  latency: {
    type: DataTypes.FLOAT,
    allowNull: true, // Can be null if device is down
  },
  status: {
    type: DataTypes.ENUM('up', 'down'),
    allowNull: false,
  },
  packet_loss: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // We use our own timestamp field
});

// Associations
Device.hasMany(MonitoringLog, { foreignKey: 'device_id', as: 'monitoringLogs' });
MonitoringLog.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

module.exports = MonitoringLog;
