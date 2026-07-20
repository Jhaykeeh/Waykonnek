/**
 * AccessControlPanel — Manage student/admin accounts and view activity logs.
 */
import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { Button, Badge, Toggle, Input } from '../ui';
import Card from '../Card';
import AdminSection from './AdminSection';
import AdminUsersTable from './AdminUsersTable';
import AdminAdminsTable from './AdminAdminsTable';
import ActivityLogList from './ActivityLogList';

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

      <AdminSection
        title="Student Accounts"
        action={(
          <Button onClick={() => { setShowAddStudent((p) => !p); setShowAddAdmin(false); }}>
            {showAddStudent ? 'Cancel' : '+ Add Student'}
          </Button>
        )}
      >
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
        <AdminUsersTable users={users} onSuspend={onSuspendUser} onDelete={onDeleteUser} />
      </AdminSection>

      <AdminSection
        title="Admin Accounts"
        action={(
          <Button onClick={() => { setShowAddAdmin((p) => !p); setShowAddStudent(false); }}>
            {showAddAdmin ? 'Cancel' : '+ Add Admin'}
          </Button>
        )}
      >
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
        <AdminAdminsTable admins={admins} />
      </AdminSection>

      <AdminSection title="Activity Logs">
        <ActivityLogList logs={logs} />
      </AdminSection>
    </>
  );
}
