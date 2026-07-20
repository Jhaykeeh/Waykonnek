import api from './api';

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
      params: { start, end },
    });
    return response.data;
  },

  // Get all usage records (admin only)
  getAllUsage: async () => {
    const response = await api.get('/bandwidth/admin/all');
    return response.data;
  },
};
