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
  const { password: _password, ...user } = account;
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