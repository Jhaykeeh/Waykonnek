import api from './api';

// Demo accounts (used when backend is unavailable)
const DEMO_ACCOUNTS = {
  'demo-student': {
    schoolId: 'demo-student',
    password: 'password',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@cit.edu',
    course: 'BSCS',
    year: '3rd Year',
    contactNumber: '09171234567',
    role: 'STUDENT',
  },
  'demo-admin': {
    schoolId: 'demo-admin',
    password: 'password',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cit.edu',
    course: 'N/A',
    year: 'N/A',
    contactNumber: '09181234567',
    role: 'ADMIN',
  },
};

function mockLogin(credentials) {
  const account = DEMO_ACCOUNTS[credentials.schoolId];
  if (!account || account.password !== credentials.password) {
    throw new Error('Invalid credentials');
  }
  const { password, ...user } = account;
  const token = 'demo-token-' + Date.now();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
}

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        const userToStore = data.user || data;
        localStorage.setItem('user', JSON.stringify(userToStore));
      }
      return data;
    } catch {
      // Fallback to mock if backend unavailable
      const user = { ...userData, role: 'STUDENT' };
      const token = 'demo-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        let userToStore = data.user || data;
        if (!userToStore.firstName) {
          try {
            const profileResponse = await api.get('/users/profile');
            const profileData = profileResponse.data.user || profileResponse.data;
            userToStore = { ...userToStore, ...profileData };
          } catch (error) {
            console.error('Profile fetch failed:', error);
          }
        }
        localStorage.setItem('user', JSON.stringify(userToStore));
        if (data.user) {
          data.user = userToStore;
        } else {
          Object.assign(data, userToStore);
        }
      }
      return data;
    } catch {
      // Fallback to mock login if backend unavailable
      return mockLogin(credentials);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update stored user data
  updateStoredUser: (userData) => {
    const currentUser = authService.getCurrentUser() || {};
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

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

export const bandwidthService = {
  // Log bandwidth usage
  logUsage: async (usageData) => {
    const response = await api.post('/bandwidth/log', usageData);
    return response.data;
  },

  // Get user bandwidth usage
  getUserUsage: async () => {
    const response = await api.get('/bandwidth/user');
    return response.data;
  },

  // Get total usage
  getTotalUsage: async () => {
    const response = await api.get('/bandwidth/user/total');
    return response.data;
  },

  // Get usage in date range
  getUsageInRange: async (start, end) => {
    const response = await api.get('/bandwidth/user/range', {
      params: { start, end }
    });
    return response.data;
  },

  // Get all usage records (admin only)
  getAllUsage: async () => {
    const response = await api.get('/bandwidth/admin/all');
    return response.data;
  },
};