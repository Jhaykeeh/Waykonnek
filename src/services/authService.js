import api from './api';

function normalizeUser(data) {
  return {
    id: data.userId ?? null,
    schoolId: data.schoolId || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    course: data.course || '',
    year: data.yearLevel || data.year || '',
    contactNumber: data.contactNumber || '',
    role: data.role === 'ADMIN' ? 'admin' : 'student',
  };
}

function persistAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export const authService = {
  login: async ({ schoolId, password }) => {
    const { data } = await api.post('/auth/login', { schoolId, password });
    const user = normalizeUser(data);
    persistAuth(data.token, user);
    return { token: data.token, user };
  },

  register: async ({ schoolId, password, email, firstName, lastName }) => {
    const { data } = await api.post('/auth/register', {
      schoolId,
      password,
      email,
      firstName,
      lastName,
    });
    const user = normalizeUser(data);
    persistAuth(data.token, user);
    return { token: data.token, user };
  },

  validateToken: async () => {
    const { data } = await api.get('/users/profile');
    const profile = data.user || data;
    const user = normalizeUser(profile);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  updateStoredUser: (userData) => {
    const current = authService.getCurrentUser() || {};
    const updated = { ...current, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
