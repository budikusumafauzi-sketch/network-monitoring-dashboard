import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DeviceManagementPage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null); // null for new, object for edit
  const [formData, setFormData] = useState({ name: '', ip_address: '', description: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await API.get('/devices');
      setDevices(res.data);
    } catch (err) {
      setError('Failed to fetch devices.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (editingDevice) {
        await API.put(`/devices/${editingDevice.id}`, formData);
        setSuccessMessage('Device updated successfully!');
      } else {
        await API.post('/devices', formData);
        setSuccessMessage('Device added successfully!');
      }
      setFormData({ name: '', ip_address: '', description: '' });
      setEditingDevice(null);
      fetchDevices(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save device.');
      console.error(err);
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setFormData({ name: device.name, ip_address: device.ip_address, description: device.description });
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      return;
    }
    setError(null);
    setSuccessMessage(null);
    try {
      await API.delete(`/devices/${deviceId}`);
      setSuccessMessage('Device deleted successfully!');
      fetchDevices(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete device.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Device Management</h2>

      {error && <div className="alert-error">{error}</div>}
      {successMessage && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{successMessage}</div>}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>{editingDevice ? 'Edit Device' : 'Add New Device'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Device Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ip_address">IP Address:</label>
            <input
              type="text"
              id="ip_address"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional):</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn">{editingDevice ? 'Update Device' : 'Add Device'}</button>
          {editingDevice && (
            <button type="button" className="btn" onClick={() => { setEditingDevice(null); setFormData({ name: '', ip_address: '', description: '' }); }} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Current Devices</h3>
        {devices.length === 0 ? (
          <p>No devices added yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>IP Address</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{device.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{device.ip_address}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{device.description}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => handleEdit(device)} className="btn" style={{ marginRight: '5px', backgroundColor: '#ffc107', color: 'black' }}>Edit</button>
                    {user?.role === 'admin' && ( // Only admin can delete
                      <button onClick={() => handleDelete(device.id)} className="btn" style={{ backgroundColor: '#dc3545' }}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeviceManagementPage;
