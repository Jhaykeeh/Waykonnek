import api from './api';

export const deviceService = {
  // Register device
  registerDevice: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },

  // Get user devices
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },

  // Get all devices (admin only)
  getAllDevices: async () => {
    const response = await api.get('/devices/admin/all');
    return response.data;
  },

  // Update device
  updateDevice: async (deviceId, deviceData) => {
    const response = await api.put(`/devices/${deviceId}`, deviceData);
    return response.data;
  },

  // Delete device
  deleteDevice: async (deviceId) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  },

  // Approve device (admin only)
  approveDevice: async (deviceId) => {
    const response = await api.put(`/devices/admin/${deviceId}/approve`);
    return response.data;
  },

  // Reject device (admin only)
  rejectDevice: async (deviceId) => {
    const response = await api.put(`/devices/admin/${deviceId}/reject`);
    return response.data;
  },
};
