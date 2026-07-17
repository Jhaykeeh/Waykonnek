/**
 * AccessControlPanel — Manage student/admin accounts and view activity logs.
 */
import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { Button, Badge, Toggle, Input } from '../ui';
import Card from '../Card';

export default function AccessControlPanel({ users, admins, logs, onAddStudent, onAddAdmin, onSuspendUser, onDeleteUser }) {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newStudent, setNewStudent] = useState({ schoolId: '', name: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' });
  const [flash, setFlash] = useState({ message: '', isError: false });

  const flashMsg = (message, isError = false) => {
    setFlash({ message, isError });
    setTimeout(() => setFlash({ message: '', isError: false }), 3000);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.schoolId.trim() || !newStudent.name.trim()) {
      flashMsg('School ID and full name are required.', true);
      return;
    }
    if (users.some((u) => u.schoolId === newStudent.schoolId)) {
      flashMsg('A student with this School ID already exists.', true);
      return;
    }
    onAddStudent(newStudent);
    flashMsg(`Student ${newStudent.name} added successfully.`);
    setNewStudent({ schoolId: '', name: '' });
    setShowAddStudent(false);
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim()) {
      flashMsg('Name and email are required.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      flashMsg('Please enter a valid email address.', true);
      return;
    }
    onAddAdmin(newAdmin);
    flashMsg(`Admin ${newAdmin.name} added successfully.`);
    setNewAdmin({ name: '', email: '', role: 'Admin' });
    setShowAddAdmin(false);
  };

  return (
    <>
      {flash.message && (
        <div style={{
          marginBottom: '20px', padding: '14px 20px',
          backgroundColor: flash.isError ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)',
          border: `1px solid ${flash.isError ? '#F44336' : '#4CAF50'}`,
          borderRadius: '10px', color: flash.isError ? '#F44336' : '#4CAF50',
          fontFamily: FONTS.primary, fontSize: '14px',
        }}>
          {flash.message}
        </div>
      )}

      {/* Student Accounts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
          Student Accounts
        </h3>
        <Button onClick={() => { setShowAddStudent(p => !p); setShowAddAdmin(false); }}>
          {showAddStudent ? 'Cancel' : '+ Add Student'}
        </Button>
      </div>

      {showAddStudent && (
        <Card style={{ marginBottom: '20px' }}>
          <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Input label="School ID" placeholder="e.g. 2024-00123" value={newStudent.schoolId}
              onChange={(e) => setNewStudent((p) => ({ ...p, schoolId: e.target.value }))} />
            <Input label="Full Name" placeholder="e.g. Juan Dela Cruz" value={newStudent.name}
              onChange={(e) => setNewStudent((p) => ({ ...p, name: e.target.value }))} />
            <Button padding="11px 24px" fullWidth={false}>Save Student</Button>
          </form>
        </Card>
      )}

      <Card style={{ padding: 0, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 80px 100px', padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`, fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>School ID</span><span>Name</span><span>Devices</span><span>Status</span>
        </div>
        {users.map((user, idx) => (
          <div key={user.schoolId} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 80px 100px', padding: '14px 24px', borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
            <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, textAlign: 'center' }}>{user.devices}/2</span>
            <Badge status={user.status} />
          </div>
        ))}
      </Card>

      {/* Admin Accounts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
          Admin Accounts
        </h3>
        <Button onClick={() => { setShowAddAdmin(p => !p); setShowAddStudent(false); }}>
          {showAddAdmin ? 'Cancel' : '+ Add Admin'}
        </Button>
      </div>

      {showAddAdmin && (
        <Card style={{ marginBottom: '20px' }}>
          <form onSubmit={handleAddAdmin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Input label="Full Name" placeholder="e.g. Jane Admin" value={newAdmin.name}
              onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))} />
            <Input label="Email" placeholder="e.g. jane@citu.edu.ph" value={newAdmin.email}
              onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} />
            <div>
              <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Role</label>
              <select value={newAdmin.role} onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value }))}
                style={{ padding: '10px 14px', border: `1px solid ${COLORS.gold.border}`, borderRadius: '8px', backgroundColor: 'rgba(61,8,8,0.3)', color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}>
                <option value="Admin">Admin</option>
                <option value="Support">Support</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <Button padding="11px 24px">Save Admin</Button>
          </form>
        </Card>
      )}

      <Card style={{ padding: 0, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px', padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`, fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Name</span><span>Email</span><span>Role</span><span>Last Login</span><span>Status</span>
        </div>
        {admins.map((admin, idx) => (
          <div key={admin.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px', padding: '14px 24px', borderBottom: idx < admins.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{admin.name}</span>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{admin.email}</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: FONTS.primary, color: admin.role === 'Super Admin' ? COLORS.gold.primary : COLORS.textBody }}>{admin.role}</span>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{admin.lastLogin}</span>
            <Badge status={admin.status} />
          </div>
        ))}
      </Card>

      {/* Activity Logs */}
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
        Activity Logs
      </h3>
      <Card style={{ padding: 0 }}>
        {logs.map((log, idx) => (
          <div key={idx} style={{
            padding: '14px 24px',
            borderBottom: idx < logs.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.gold.primary, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                <strong>{log.admin}</strong> — {log.action}: <span style={{ color: COLORS.textMuted }}>{log.target}</span>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{log.time}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
