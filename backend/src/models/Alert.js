const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Device = require('./Device');

const Alert = sequelize.define('Alert', {
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
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // We use our own created_at field
});

// Associations
Device.hasMany(Alert, { foreignKey: 'device_id', as: 'alerts' });
Alert.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

module.exports = Alert;
