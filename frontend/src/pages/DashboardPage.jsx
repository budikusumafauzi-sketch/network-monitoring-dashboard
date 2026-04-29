import React, { useEffect, useState } from "react";
import axios from "axios";

// 📊 IMPORT CHART
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// REGISTER
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function DashboardPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/devices");
        setDevices(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDevices();

    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  // 📊 HITUNG DATA CHART
  const onlineCount = devices.filter((d) => d.status === "online").length;
  const offlineCount = devices.filter((d) => d.status === "offline").length;

  const chartData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        label: "Device Status",
        data: [onlineCount, offlineCount],
        backgroundColor: ["green", "red"],
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Device Status Overview",
      },
    },
  };
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ padding: "10px", border: "1px solid #ccc" }}>
          <h3>Total</h3>
          <p>{devices.length}</p>
        </div>

        <div
          style={{ padding: "10px", border: "1px solid #ccc", color: "green" }}
        >
          <h3>Online</h3>
          <p>{onlineCount}</p>
        </div>

        <div
          style={{ padding: "10px", border: "1px solid #ccc", color: "red" }}
        >
          <h3>Offline</h3>
          <p>{offlineCount}</p>
        </div>
      </div>

      <div style={{ width: "400px", marginBottom: "30px" }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* DEVICE LIST */}
      {devices.map((device) => (
        <div
          key={device.id}
          style={{
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h4>{device.name}</h4>
          <p>
            Status:{" "}
            <span
              style={{ color: device.status === "online" ? "green" : "red" }}
            >
              {device.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;
