/**
 * Centralized mock data for development / demo.
 * Replace with real API responses in production.
 */

export const MOCK_REQUESTS = [
  { id: 1, schoolId: '2021-00123', name: 'Juan Dela Cruz', brand: 'Apple', model: 'iPhone 14 Pro', deviceNo: 1, status: 'APPROVED', submitted: '2 hours ago' },
  { id: 2, schoolId: '2021-00456', name: 'Maria Santos', brand: 'Samsung', model: 'Galaxy S23', deviceNo: 1, status: 'APPROVED', submitted: '4 hours ago' },
  { id: 3, schoolId: '2020-00789', name: 'Jose Reyes', brand: 'Lenovo', model: 'IdeaPad 5', deviceNo: 2, status: 'PENDING', submitted: '1 day ago' },
  { id: 4, schoolId: '2022-00012', name: 'Ana Cruz', brand: 'Xiaomi', model: 'Redmi Note 12', deviceNo: 1, status: 'APPROVED', submitted: '2 days ago' },
];

export const MOCK_USERS = [
  { id: 1, schoolId: '2021-00123', name: 'Juan Dela Cruz', devices: 1, usage: '1.2 GB', usageRaw: 1.2, status: 'Active', role: 'student', suspended: false },
  { id: 2, schoolId: '2021-00456', name: 'Maria Santos', devices: 0, usage: '0 GB', usageRaw: 0, status: 'Pending', role: 'student', suspended: false },
  { id: 3, schoolId: '2020-00789', name: 'Jose Reyes', devices: 2, usage: '4.1 GB', usageRaw: 4.1, status: 'Active', role: 'student', suspended: false },
  { id: 4, schoolId: '2022-00012', name: 'Ana Cruz', devices: 1, usage: '0.8 GB', usageRaw: 0.8, status: 'Active', role: 'student', suspended: false },
  { id: 5, schoolId: '2023-00345', name: 'Pedro Bautista', devices: 2, usage: '5.0 GB', usageRaw: 5.0, status: 'Capped', role: 'student', suspended: false },
];

export const MOCK_ADMINS = [
  { id: 1, name: 'IT Administrator', email: 'admin@citu.edu.ph', role: 'Super Admin', lastLogin: '1 hour ago', status: 'Active' },
  { id: 2, name: 'John Techstaff', email: 'jtech@citu.edu.ph', role: 'Admin', lastLogin: '3 hours ago', status: 'Active' },
  { id: 3, name: 'Mary Support', email: 'msupport@citu.edu.ph', role: 'Support', lastLogin: '2 days ago', status: 'Inactive' },
];

export const MOCK_LOGS = [
  { time: '10:02 AM', admin: 'IT Administrator', action: 'Approved device request', target: 'Juan Dela Cruz' },
  { time: '09:45 AM', admin: 'John Techstaff', action: 'Suspended user', target: 'Pedro Bautista' },
  { time: '09:30 AM', admin: 'IT Administrator', action: 'Changed bandwidth limit', target: 'All Students' },
  { time: 'Yesterday', admin: 'Mary Support', action: 'Reset password', target: 'Maria Santos' },
  { time: 'Yesterday', admin: 'IT Administrator', action: 'Added new admin', target: 'Mary Support' },
];

export const MOCK_DAILY_HISTORY = [
  { day: 'Mon', gb: 5.1 },
  { day: 'Tue', gb: 3.8 },
  { day: 'Wed', gb: 2.4 },
  { day: 'Thu', gb: 1.9 },
  { day: 'Fri', gb: 3.2 },
  { day: 'Sat', gb: 2.1 },
  { day: 'Sun', gb: 1.3 },
];

export const MOCK_HOURLY_HISTORY = [
  { day: '8am', gb: 0.2 },
  { day: '10am', gb: 0.8 },
  { day: '12pm', gb: 1.4 },
  { day: '2pm', gb: 0.9 },
  { day: '4pm', gb: 1.1 },
  { day: '6pm', gb: 1.7 },
  { day: '8pm', gb: 2.1 },
];

export const MOCK_CONNECTED_DEVICES = [
  { icon: '📱', name: 'iPhone 14 Pro', ip: '192.168.1.102', band: '5GHz', usageGb: 1.24, pct: 38.8, color: '#4CAF50' },
  { icon: '💻', name: 'MacBook Air', ip: '192.168.1.104', band: '5GHz', usageGb: 1.60, pct: 50.0, color: '#d4a843' },
  { icon: '📺', name: 'Smart TV', ip: '192.168.1.108', band: '2.4GHz', usageGb: 0.36, pct: 11.2, color: '#e8a050' },
];

export const MOCK_WEEKLY_REPORT = [1.2, 3.4, 2.1, 4.5, 3.8, 2.9, 1.7];
export const MOCK_MONTHLY_REPORT = [12, 18, 15, 22, 30, 28, 25, 19, 17, 21, 24, 20];

export const MOCK_VOUCHERS = {
  'CITU-2024-AAAA': { uses: 0, max: 2 },
  'CITU-2024-BBBB': { uses: 1, max: 2 },
  'CITU-2024-CCCC': { uses: 2, max: 2 },
  'CITU-2024-DDDD': { uses: 0, max: 2 },
};
