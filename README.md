# Network Monitoring Dashboard

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MySQL%20%7C%20Sequelize-green)](https://nodejs.org/)
[![Tech Stack](https://img.shields.io/badge/Frontend-React.js%20%7C%20Chart.js%20%7C%20Axios-blue)](https://reactjs.org/)
[![Containerization](https://img.shields.io/badge/Containerization-Docker%20%7C%20Docker--Compose-lightgrey)](https://www.docker.com/)

## Project Overview

The Network Monitoring Dashboard is a full-stack web application designed to monitor the status and performance of multiple network devices in real-time. It provides a robust authentication system with role-based access control, comprehensive device management capabilities, automated network monitoring with an alert system, and an intuitive analytics dashboard with real-time data visualization. Built with a production-ready structure and best practices, this application is ideal for IT professionals and system administrators needing a reliable solution to oversee their network infrastructure.

## Features

-   **Authentication System:** Secure user registration, login, JWT token generation, and protected routes with role-based access (admin/user).
-   **Device Management:** Full CRUD operations for network devices (name, IP address, description) with IP address validation. Admin users have exclusive rights to delete devices.
-   **Automated Network Monitoring:** Devices are automatically pinged every 5 seconds. Monitoring logs capture latency, status (up/down), and packet loss.
-   **Alert System:** Automatic alert generation if a device is detected as "down" for 3 consecutive checks, stored in a dedicated alerts table.
-   **Analytics Dashboard:** Provides per-device statistics including average latency, uptime percentage, last known status, and a history of monitoring logs.
-   **Real-time Data Visualization:** Interactive charts displaying real-time latency data for monitored devices.
-   **Responsive Modern UI:** Clean, intuitive, and responsive user interface with a dark mode toggle.
-   **Dockerized Deployment:** Ready for immediate deployment using Docker and Docker Compose for easy setup and scalability.

## Architecture Explanation

The application follows a clean, modular, and scalable architecture, separating concerns between the frontend, backend, and database layers.

-   **Frontend (React.js):** A single-page application that consumes the backend API. It features a component-based structure, global authentication context, protected routes, and an Axios-based API service layer.
-   **Backend (Node.js/Express.js):** A RESTful API built with Express.js. It includes a structured directory for controllers, routes, models, middleware, and services. Sequelize ORM is used for interacting with the MySQL database. JWT is used for authentication, and `node-cron` handles background monitoring tasks.
-   **Database (MySQL):** Stores user, device, monitoring log, and alert data. Structured with proper normalization, foreign keys, and indexing for performance.
-   **Containerization (Docker):** Both frontend and backend are containerized, along with the MySQL database, using Docker Compose for orchestrating multi-container applications.

## Tech Stack

**Backend:**
-   **Node.js:** JavaScript runtime environment
-   **Express.js:** Web application framework
-   **MySQL:** Relational database
-   **Sequelize ORM:** Object-Relational Mapper for Node.js
-   **JWT (JSON Web Tokens):** For authentication
-   **bcrypt:** For password hashing
-   **node-cron:** For scheduling automated tasks
-   **ping (npm package):** For network device reachability checks
-   **pino & pino-pretty:** For structured logging

**Frontend:**
-   **React.js:** JavaScript library for building user interfaces
-   **Axios:** Promise-based HTTP client
-   **Chart.js:** Flexible JavaScript charting library
-   **React-Chartjs-2:** React wrapper for Chart.js
-   **React Router DOM:** For navigation
-   **Vite:** Frontend build tool

**Database:**
-   **MySQL 8.0**

**Containerization:**
-   **Docker**
-   **Docker Compose**

## API Documentation

All API endpoints are prefixed with `/api`.

| Method | Endpoint                       | Description                                                     | Authentication | Roles        | Request Body                                     | Response                                                   |
| :----- | :----------------------------- | :-------------------------------------------------------------- | :------------- | :----------- | :----------------------------------------------- | :--------------------------------------------------------- |
| `POST` | `/api/auth/register`           | Register a new user                                             | None           | N/A          | `{ username, email, password, [role] }`          | `{ id, username, email, role, token }`                     |
| `POST` | `/api/auth/login`              | Authenticate user and get JWT token                             | None           | N/A          | `{ email, password }`                            | `{ id, username, email, role, token }`                     |
| `GET`  | `/api/auth/me`                 | Get current authenticated user's details                        | `Bearer Token` | `user`, `admin` | None                                             | `{ user: { id, username, email, role } }`                  |
| `GET`  | `/api/devices`                 | Get all devices owned by the authenticated user                 | `Bearer Token` | `user`, `admin` | None                                             | `Array<Device>`                                            |
| `POST` | `/api/devices`                 | Create a new device                                             | `Bearer Token` | `user`, `admin` | `{ name, ip_address, description }`              | `Device`                                                   |
| `GET`  | `/api/devices/:id`             | Get a single device by ID                                       | `Bearer Token` | `user`, `admin` | None                                             | `Device`                                                   |
| `PUT`  | `/api/devices/:id`             | Update a device by ID                                           | `Bearer Token` | `user`, `admin` | `{ [name], [ip_address], [description] }`        | `Device`                                                   |
| `DELETE` | `/api/devices/:id`           | Delete a device by ID                                           | `Bearer Token` | `admin`      | None                                             | `{ message: 'Device removed' }`                            |
| `GET`  | `/api/devices/:id/history`     | Get monitoring history for a specific device                    | `Bearer Token` | `user`, `admin` | None                                             | `Array<MonitoringLog>`                                     |
| `GET`  | `/api/devices/:id/statistics`  | Get statistics (avg latency, uptime) for a device               | `Bearer Token` | `user`, `admin` | None                                             | `{ latestStatus, averageLatency, uptimePercentage, ... }`  |
| `GET`  | `/api/alerts`                  | Get all alerts for devices owned by the authenticated user      | `Bearer Token` | `user`, `admin` | None                                             | `Array<Alert>`                                             |

**`Device` Object:**
```json
{
  "id": 1,
  "name": "Router 1",
  "ip_address": "192.168.1.1",
  "description": "Main office router",
  "userId": 1,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

**`MonitoringLog` Object:**
```json
{
  "id": 1,
  "device_id": 1,
  "latency": 5.2,
  "status": "up",
  "packet_loss": 0,
  "timestamp": "2023-01-01T12:00:05Z"
}
```

**`Alert` Object:**
```json
{
  "id": 1,
  "device_id": 1,
  "message": "Device Router 1 (192.168.1.1) has been down for 3 consecutive checks.",
  "resolved": false,
  "created_at": "2023-01-01T12:00:20Z"
}
```

## Database Schema Explanation

The database consists of four main tables, managed by Sequelize ORM and defined in `backend/sql/init.sql`:

1.  **`Users`**: Stores user authentication details.
    *   `id`: Primary Key, Auto-increment.
    *   `username`: Unique username.
    *   `email`: Unique email, used for login.
    *   `password`: Hashed password.
    *   `role`: `ENUM('user', 'admin')`, defines access level.
    *   `createdAt`, `updatedAt`: Automatic timestamps.
2.  **`Devices`**: Stores information about monitored network devices.
    *   `id`: Primary Key, Auto-increment.
    *   `name`: Display name of the device.
    *   `ip_address`: Unique IP address of the device.
    *   `description`: Optional description.
    *   `userId`: Foreign Key to `Users` table (ON DELETE CASCADE).
    *   `createdAt`, `updatedAt`: Automatic timestamps.
3.  **`MonitoringLogs`**: Records the results of each device monitoring check.
    *   `id`: Primary Key, Auto-increment.
    *   `device_id`: Foreign Key to `Devices` table (ON DELETE CASCADE).
    *   `latency`: Latency in milliseconds (null if device is down).
    *   `status`: `ENUM('up', 'down')`, current status of the device.
    *   `packet_loss`: Optional, if available from ping.
    *   `timestamp`: When the log was recorded.
4.  **`Alerts`**: Stores generated alerts for device downtime.
    *   `id`: Primary Key, Auto-increment.
    *   `device_id`: Foreign Key to `Devices` table (ON DELETE CASCADE).
    *   `message`: Description of the alert.
    *   `resolved`: `BOOLEAN`, indicates if the alert has been addressed.
    *   `created_at`: When the alert was generated.

All foreign keys are configured with `ON DELETE CASCADE` to ensure data integrity when parent records are deleted. Appropriate indexes are created for common query fields to optimize database performance.

## Installation Steps

Follow these steps to set up and run the project locally.

### Prerequisites

-   Git
-   Docker Desktop (includes Docker Engine and Docker Compose)

### 1. Clone the repository

```bash
git clone https://github.com/budikusumafauzi-sketch/network-monitoring-dashboard.git
cd network-monitoring-dashboard
```

### 2. Configure Environment Variables

Create `.env` files for both backend and frontend by copying their respective example files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit these `.env` files and fill in the required values.

**`backend/.env`**:
```
PORT=5000
NODE_ENV=development

DB_HOST=mysql_db
DB_USER=root
DB_PASSWORD=password
DB_NAME=network_monitoring

JWT_SECRET=your_very_secret_jwt_key_here # IMPORTANT: Change this to a strong, random string
JWT_EXPIRES_IN=1h
```

**`frontend/.env`**:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Docker Instructions

The entire application is containerized using Docker Compose.

### 1. Build and Run the containers

From the root of the project directory (`network-monitoring-dashboard/`), run:

```bash
docker-compose up --build
```

This command will:
-   Build the Docker images for the backend and frontend.
-   Create and start the `mysql_db`, `backend`, and `frontend` services.
-   Map ports: `3306` for MySQL, `5000` for backend API, and `80` for the frontend.
-   Initialize the MySQL database with the schema defined in `backend/sql/init.sql`.

### 2. Access the Application

Once all services are up:
-   **Frontend:** Open your web browser and navigate to `http://localhost`.
-   **Backend API:** The API will be accessible at `http://localhost:5000/api`.

### 3. Stop the containers

To stop the running services, press `Ctrl+C` in the terminal where `docker-compose up` is running.
To stop and remove the containers, networks, and volumes (for a clean slate):

```bash
docker-compose down -v
```

## Local Development Guide (Without Docker for individual services)

If you prefer to run services individually without Docker Compose (e.g., for easier debugging):

### Backend Development

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the backend server:**
    ```bash
    npm run dev # Uses nodemon for auto-restarts
    ```
    The backend API will run on `http://localhost:5000`. Ensure you have a MySQL database running separately and update `backend/.env` with its connection details.

### Frontend Development

1.  **Navigate to frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will typically run on `http://localhost:5173` (or another port if 5173 is busy). Update `frontend/.env` if your backend is not on `http://localhost:5000/api`.

## Deployment Guide

### Deploy Frontend to Vercel

1.  **Create a Vercel account** and install the Vercel CLI.
2.  **Login to Vercel CLI:**
    ```bash
    vercel login
    ```
3.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
4.  **Deploy:**
    ```bash
    vercel
    ```
    Follow the prompts. Vercel will detect it's a Vite React app and configure it automatically.
5.  **Configure Environment Variables:** In your Vercel project settings, add the `VITE_API_BASE_URL` environment variable, pointing to your deployed backend API URL (e.g., `https://your-backend-api.com/api`).

### Deploy Backend to a VPS (Ubuntu)

1.  **Provision an Ubuntu VPS:** Set up a new Ubuntu server (e.g., AWS EC2, DigitalOcean, Linode).
2.  **SSH into your VPS.**
3.  **Install Node.js and npm:**
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
4.  **Install MySQL Server:**
    ```bash
    sudo apt install mysql-server
    sudo mysql_secure_installation # Follow prompts to secure MySQL
    ```
5.  **Create a MySQL User and Database:**
    ```sql
    sudo mysql -u root -p
    CREATE DATABASE network_monitoring;
    CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
    GRANT ALL PRIVILEGES ON network_monitoring.* TO 'your_db_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```
    Remember to use strong passwords.
6.  **Clone your repository:**
    ```bash
    git clone https://github.com/budikusumafauzi-sketch/network-monitoring-dashboard.git
    cd network-monitoring-dashboard/backend
    ```
7.  **Install backend dependencies:**
    ```bash
    npm install
    ```
8.  **Create and configure `backend/.env`:**
    ```bash
    cp .env.example .env
    ```
    Edit `.env` with your production database credentials (`DB_HOST` will likely be `localhost` for a local MySQL server), and a strong `JWT_SECRET`.
9.  **Initialize Database Schema:**
    ```bash
    mysql -u your_db_user -p network_monitoring < sql/init.sql
    ```
10. **Use a Process Manager (e.g., PM2) to keep the backend running:**
    ```bash
    sudo npm install -g pm2
    pm2 start server.js --name "network-monitoring-backend"
    pm2 save
    pm2 startup
    ```
    This will ensure your Node.js application restarts automatically on server reboots.
11. **Configure Nginx (Optional, but recommended for reverse proxy and SSL):**
    ```bash
    sudo apt install nginx
    sudo nano /etc/nginx/sites-available/network-monitoring-api
    ```
    Add a configuration similar to this (replace `your-backend-api.com` with your domain):
    ```nginx
    server {
        listen 80;
        server_name your-backend-api.com;

        location / {
            proxy_pass http://localhost:5000; # Port where your Node.js app runs
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Enable the site and restart Nginx:
    ```bash
    sudo ln -s /etc/nginx/sites-available/network-monitoring-api /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```
12. **Set up SSL with Certbot (Recommended):**
    ```bash
    sudo snap install --classic certbot
    sudo certbot --nginx -d your-backend-api.com
    ```
    Follow the prompts to enable HTTPS.

### Production Environment Variable Configuration

-   **Backend:** Ensure `NODE_ENV=production` and all database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `JWT_SECRET`, and `JWT_EXPIRES_IN` are set correctly and securely in the `backend/.env` file on your VPS or Docker environment.
-   **Frontend:** On Vercel, set `VITE_API_BASE_URL` to the public URL of your deployed backend API.

### Security Recommendations

1.  **Strong Passwords:** Use strong, unique passwords for all user accounts, databases, and server access.
2.  **Environment Variables:** Never hardcode sensitive information (API keys, database credentials) directly into your code. Always use environment variables.
3.  **HTTPS:** Always use HTTPS for both frontend and backend communication to encrypt data in transit.
4.  **Input Validation:** Ensure all user inputs are thoroughly validated on both the frontend and backend to prevent injection attacks (SQL injection, XSS).
5.  **CORS Configuration:** Restrict CORS to only trusted frontend origins in production.
6.  **Rate Limiting:** Implement rate limiting on authentication endpoints to prevent brute-force attacks.
7.  **Regular Updates:** Keep all dependencies, Node.js, npm, Docker, and operating systems up to date to patch security vulnerabilities.
8.  **Principle of Least Privilege:** Grant services and users only the minimum necessary permissions. For example, your database user should only have access to the `network_monitoring` database, not root privileges.
9.  **Backup Strategy:** Implement a regular database backup strategy.

## Screenshot Placeholders

*   **Login Page:** [Screenshot of Login Page]
*   **Register Page:** [Screenshot of Register Page]
*   **Dashboard Page (Light Mode):** [Screenshot of Dashboard showing device status, alerts, and charts]
*   **Dashboard Page (Dark Mode):** [Screenshot of Dashboard in dark mode]
*   **Device Management Page:** [Screenshot of Device Management showing CRUD operations]

## Future Improvements

-   **User Interface Enhancements:** More polished UI/UX, better loading indicators, and notifications.
-   **Advanced Charting:** More types of charts, historical data views, and filtering options for monitoring logs.
-   **Push Notifications:** Integrate WebSockets (Socket.IO) for real-time alert push notifications to the frontend.
-   **More Robust Monitoring:** Implement checks beyond simple ping (e.g., port scanning, HTTP checks, SNMP).
-   **Detailed Alerting:** Configurable alert thresholds, different notification channels (email, SMS).
-   **Audit Logs:** Implement a system to log all significant user actions.
-   **Multi-tenancy:** Support for multiple independent organizations/users managing their own devices.
-   **Comprehensive Testing:** Add unit, integration, and end-to-end tests for both frontend and backend.
-   **CI/CD Pipeline:** Set up automated deployment pipelines for continuous integration and delivery.
-   **Admin Panel:** A dedicated admin interface for managing users and roles.
-   **Export Data:** Functionality to export monitoring data and reports.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
