import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data state
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchDashboardData = async () => {
    try {
      const devicesRes = await API.get('/devices');
      setDevices(devicesRes.data);

      const alertsRes = await API.get('/alerts');
      setAlerts(alertsRes.data);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchDeviceStatsAndHistory = async () => {
    // This is a simplified example. In a real app, you might fetch history for a selected device.
    // For now, let's just get statistics for all devices.
    const newChartData = {
      labels: [],
      datasets: [],
    };

    if (devices.length > 0) {
      for (const device of devices) {
        try {
          const historyRes = await API.get(`/devices/${device.id}/history`);
          const history = historyRes.data.reverse(); // Oldest first for chart

          if (history.length > 0) {
            newChartData.labels = history.map(log =>
              new Date(log.timestamp).toLocaleTimeString()
            );

            newChartData.datasets.push({
              label: `${device.name} Latency (ms)`,
              data: history.map(log => log.latency),
              borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color
              backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.2)`,
              fill: false,
              tension: 0.1,
            });
          }
        } catch (err) {
          console.error(`Failed to fetch history for device ${device.name}:`, err);
        }
      }
    }
    setChartData(newChartData);
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time refresh for dashboard data and charts
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchDeviceStatsAndHistory(); // This will re-fetch history for ALL devices. Optimize for single device in real app.
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [devices.length]); // Re-run effect if number of devices changes to update charts

  useEffect(() => {
    if (devices.length > 0) {
      fetchDeviceStatsAndHistory();
    }
  }, [devices]);


  if (loading) {
    return <div className="container">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="container alert-error">{error}</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.username} ({user?.role})</h2>
        <button onClick={logout} className="btn">Logout</button>
      </div>

      <div className="card">
        <h3>Your Devices</h3>
        {devices.length === 0 ? (
          <p>No devices added yet. Go to <a href="/devices">Device Management</a> to add some.</p>
        ) : (
          <div>
            {devices.map((device) => (
              <div key={device.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                <strong>{device.name}</strong> ({device.ip_address}) -
                <span style={{ color: device.latestStatus === 'up' ? 'green' : 'red' }}>
                  {device.latestStatus ? device.latestStatus.toUpperCase() : 'UNKNOWN'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Real-time Network Latency</h3>
        {chartData.datasets.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>No monitoring data available for charts yet.</p>
        )}
      </div>

      <div className="card">
        <h3>Recent Alerts</h3>
        {alerts.length === 0 ? (
          <p>No active alerts.</p>
        ) : (
          <div>
            {alerts.slice(0, 5).map((alert) => ( // Show latest 5 alerts
              <div key={alert.id} className="alert-error" style={{ marginBottom: '5px' }}>
                <strong>Device: {alert.device?.name || 'N/A'} ({alert.device?.ip_address || 'N/A'})</strong> - {alert.message}
                <br />
                <small>{new Date(alert.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/devices" className="btn">Manage Devices</a>
      </div>
    </div>
  );
};

export default DashboardPage;
