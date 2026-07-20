/**
 * AdminDashboardPage — Admin panel with 6 tabs: Overview, Users, Device Requests,
 * Reports, Access Control, and Settings.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../services/userService';
import { deviceService } from '../services/deviceService';
import api from '../services/api';
import { COLORS, FONTS, ADMIN_SIDEBAR_ITEMS } from '../constants/theme';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboardHeader from '../components/admin/AdminDashboardHeader';
import OverviewPanel from '../components/admin/OverviewPanel';
import DeviceRequestsPanel from '../components/admin/DeviceRequestsPanel';
import UsageReportsPanel from '../components/admin/UsageReportsPanel';
import AdminStudentsPanel from '../components/admin/AdminStudentsPanel';
import AccessControlPanel from '../components/admin/AccessControlPanel';
import AdminSettingsPanel from '../components/admin/AdminSettingsPanel';
import { MOCK_USERS, MOCK_REQUESTS } from '../data/mockData';

export default function AdminDashboardPage({ onLogout }) {
  const navigateRouter = useNavigate();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState('overview');

  const PATH_TO_KEY = (path) => {
    if (!path) return 'overview';
    const p = path.toLowerCase();
    if (p.includes('network-overview') || p === '/admin' || p.endsWith('/admin') || p.includes('/admin/overview')) return 'overview';
    if (p.includes('/all-users') || p.includes('/admin/users')) return 'users';
    if (p.includes('/device-requests') || p.includes('/admin/devices')) return 'devices';
    if (p.includes('/usage-reports') || p.includes('/admin/reports')) return 'reports';
    if (p.includes('/access-control') || p.includes('/admin/access')) return 'access';
    if (p.includes('/admin-panel') || p.includes('/admin/admin')) return 'admin';
    return 'overview';
  };

  const KEY_TO_PATH = {
    overview: '/network-overview',
    users: '/all-users',
    devices: '/device-requests',
    reports: '/usage-reports',
    access: '/access-control',
    admin: '/admin-panel',
  };
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRaw = localStorage.getItem('pending_registrations');
        const pending = pendingRaw ? JSON.parse(pendingRaw) : [];

        const [allUsers, allDevices] = await Promise.all([
          userService.getAllUsers().catch(() => []),
          deviceService.getAllDevices().catch(() => []),
        ]);

        let apiRequests = [];
        if (Array.isArray(allDevices) && allDevices.length > 0) {
          apiRequests = allDevices.map((d) => ({
            id: d.id,
            schoolId: d.userId?.toString() || '',
            name: d.brand + ' ' + d.model,
            brand: d.brand,
            model: d.model,
            voucherCode: null,
            deviceNo: d.approvalStatus === 'PENDING' ? 2 : 1,
            status: d.approvalStatus || (d.active ? 'APPROVED' : 'PENDING'),
            submitted: new Date(d.createdAt || Date.now()).toLocaleString(),
          }));
        }
        setRequests([...pending, ...apiRequests]);

        if (Array.isArray(allUsers) && allUsers.length > 0) {
          setUsers(allUsers.map((u) => ({
            id: u.id,
            schoolId: u.schoolId,
            name: u.schoolId,
            devices: 0,
            usage: '0 GB',
            usageRaw: 0,
            status: u.status === 'DISABLED' ? 'Suspended' : 'Active',
            role: u.role === 'ADMIN' ? 'admin' : 'student',
            suspended: u.status === 'DISABLED',
          })));
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };
    fetchData();
  }, []);

  // Sync activeKey with URL
  useEffect(() => {
    const k = PATH_TO_KEY(location.pathname);
    setActiveKey(k);
  }, [location.pathname]);

  const addLog = (action, target) => {
    setLogs((prev) => [{ time: 'Just now', admin: 'IT Administrator', action, target }, ...prev]);
  };

  const handleApprove = async (id) => {
    try { await deviceService.approveDevice(id); } catch { /* fallback to local */ }
    setRequests((prev) => {
      const updated = prev.map((r) => r.id === id ? { ...r, status: 'APPROVED' } : r);
      localStorage.setItem('pending_registrations', JSON.stringify(updated.filter((r) => r.voucherCode && r.status === 'PENDING')));
      return updated;
    });
    addLog('Approved device request', `Device #${id}`);
  };

  const handleReject = async (id) => {
    try { await deviceService.rejectDevice(id); } catch { /* fallback to local */ }
    setRequests((prev) => {
      const updated = prev.map((r) => r.id === id ? { ...r, status: 'REJECTED' } : r);
      localStorage.setItem('pending_registrations', JSON.stringify(updated.filter((r) => r.voucherCode && r.status === 'PENDING')));
      return updated;
    });
    addLog('Rejected device request', `Device #${id}`);
  };

  const handleSuspend = (userId) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, suspended: !u.suspended, status: u.suspended ? 'Active' : 'Suspended' } : u));
    api.put(`/users/${userId}/disable`).catch(() => {});
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addLog('Deleted user', `User #${userId}`);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleAddStudent = (student) => {
    setUsers((prev) => [...prev, {
      schoolId: student.schoolId, name: student.name,
      devices: 0, usage: '0 GB', usageRaw: 0,
      status: 'Pending', role: 'student', suspended: false,
    }]);
    addLog('Added student account', student.name);
  };

  const handleAddAdmin = (admin) => {
    const nextId = admins.length ? Math.max(...admins.map((a) => a.id)) + 1 : 1;
    setAdmins((prev) => [...prev, {
      id: nextId, name: admin.name, email: admin.email, role: admin.role,
      lastLogin: 'Never', status: 'Active',
    }]);
    addLog('Added new admin', admin.name);
  };

  const pending = requests.filter((r) => r.status === 'PENDING').length;
  const approved = requests.filter((r) => r.status === 'APPROVED').length;

  const renderPanel = () => {
    switch (activeKey) {
      case 'overview':
        return <OverviewPanel users={users} pending={pending} approved={approved} />;
      case 'users':
        return (
          <AdminStudentsPanel
            users={users}
            onAddStudent={handleAddStudent}
            onSuspendUser={handleSuspend}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'devices':
        return <DeviceRequestsPanel requests={requests} onApprove={handleApprove} onReject={handleReject} />;
      case 'reports':
        return <UsageReportsPanel users={users} />;
      case 'access':
        return <AccessControlPanel users={users} admins={admins} logs={logs} onAddStudent={handleAddStudent} onAddAdmin={handleAddAdmin} onSuspendUser={handleSuspend} onDeleteUser={handleDeleteUser} />;
      case 'admin':
        return <AdminSettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      <AdminSidebar activeKey={activeKey} onSelect={(key) => { const path = KEY_TO_PATH[key] || '/network-overview'; navigateRouter(path); }} pendingCount={pending} onLogout={onLogout} />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        <AdminDashboardHeader activeKey={activeKey} />

        <main style={{ padding: '32px 40px' }}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
