/**
 * AdminDashboardPage — Admin panel with 6 tabs: Overview, Users, Device Requests,
 * Reports, Access Control, and Settings.
 */

import { useState, useEffect } from 'react';
import { userService, deviceService } from '../services/authService';
import api from '../services/api';
import { COLORS, FONTS, ADMIN_SIDEBAR_ITEMS } from '../constants/theme';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import OverviewPanel from '../components/admin/OverviewPanel';
import DeviceRequestsPanel from '../components/admin/DeviceRequestsPanel';
import UsageReportsPanel from '../components/admin/UsageReportsPanel';
import AccessControlPanel from '../components/admin/AccessControlPanel';
import AdminSettingsPanel from '../components/admin/AdminSettingsPanel';
import { MOCK_USERS, MOCK_REQUESTS } from '../data/mockData';

export default function AdminDashboardPage({ onLogout }) {
  const [activeKey, setActiveKey] = useState('overview');
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
          <>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
              Registered Students ({users.length})
            </h3>
            <Card style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 100px 100px 80px', padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`, fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Student</span><span>School ID</span><span>Devices</span><span>Usage</span><span>Status</span><span>Action</span><span>Delete</span>
              </div>
              {users.map((user, idx) => (
                <div key={user.schoolId} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 100px 100px 80px', padding: '14px 24px', borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
                  <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
                  <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, textAlign: 'center' }}>{user.devices}/2</span>
                  <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono }}>{user.usage}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', fontFamily: FONTS.mono,
                    backgroundColor: user.status === 'Active' ? 'rgba(76,175,80,0.15)' : user.status === 'Capped' ? 'rgba(244,67,54,0.15)' : 'rgba(255,193,7,0.15)',
                    color: user.status === 'Active' ? '#4CAF50' : user.status === 'Capped' ? '#F44336' : '#FFC107',
                  }}>{user.status}</span>
                  <button onClick={() => handleSuspend(user.id)} style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: FONTS.primary, fontWeight: 'bold',
                    backgroundColor: user.suspended ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                    color: user.suspended ? '#4CAF50' : '#F44336',
                    border: user.suspended ? '1px solid rgba(76,175,80,0.4)' : '1px solid rgba(244,67,54,0.4)',
                  }}>{user.suspended ? '✓ Restore' : '⊘ Suspend'}</button>
                  <button onClick={() => handleDeleteUser(user.id)} style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: FONTS.primary, fontWeight: 'bold',
                    backgroundColor: 'rgba(244,67,54,0.15)', color: '#F44336', border: '1px solid rgba(244,67,54,0.4)',
                  }}>🗑 Delete</button>
                </div>
              ))}
            </Card>
          </>
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
      <AdminSidebar activeKey={activeKey} onSelect={setActiveKey} pendingCount={pending} onLogout={onLogout} />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        <header style={{
          backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
            {ADMIN_SIDEBAR_ITEMS.find((i) => i.key === activeKey)?.icon}{' '}
            {ADMIN_SIDEBAR_ITEMS.find((i) => i.key === activeKey)?.label}
          </span>
          <span style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
            CITU-Bandwidth Monitoring System · Admin
          </span>
        </header>

        <main style={{ padding: '32px 40px' }}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
