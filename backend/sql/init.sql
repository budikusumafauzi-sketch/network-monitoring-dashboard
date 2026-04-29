-- Use the database specified in docker-compose.yml
USE network_monitoring;

-- Table: users
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);

-- Table: devices
CREATE TABLE IF NOT EXISTS `Devices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `userId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE
);

-- Table: MonitoringLogs
CREATE TABLE IF NOT EXISTS `MonitoringLogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `device_id` INT NOT NULL,
  `latency` FLOAT,
  `status` ENUM('up', 'down') NOT NULL,
  `packet_loss` FLOAT,
  `timestamp` DATETIME NOT NULL,
  FOREIGN KEY (`device_id`) REFERENCES `Devices`(`id`) ON DELETE CASCADE
);

-- Table: Alerts
CREATE TABLE IF NOT EXISTS `Alerts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `device_id` INT NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `resolved` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`device_id`) REFERENCES `Devices`(`id`) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX `idx_users_email` ON `Users` (`email`);
CREATE INDEX `idx_devices_userId` ON `Devices` (`userId`);
CREATE INDEX `idx_monitoringlogs_device_id` ON `MonitoringLogs` (`device_id`);
CREATE INDEX `idx_alerts_device_id` ON `Alerts` (`device_id`);

-- Optional: Seed initial admin user if needed (you might do this via a separate script or manual insert)
-- INSERT INTO Users (username, email, password, role, createdAt, updatedAt) VALUES ('admin', 'admin@example.com', '$2a$10$YOUR_HASHED_PASSWORD_HERE', 'admin', NOW(), NOW());
