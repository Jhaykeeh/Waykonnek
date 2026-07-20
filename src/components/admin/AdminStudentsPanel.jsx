import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { Button, Input } from '../ui';
import Card from '../Card';
import AdminSection from './AdminSection';
import AdminUsersTable from './AdminUsersTable';

export default function AdminStudentsPanel({ users, onAddStudent, onSuspendUser, onDeleteUser }) {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ schoolId: '', name: '' });
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
        title="Registered Students"
        action={(
          <Button onClick={() => setShowAddStudent((p) => !p)}>
            {showAddStudent ? 'Cancel' : '+ Add Student'}
          </Button>
        )}
      >
        {showAddStudent && (
          <Card style={{ marginBottom: '20px' }}>
            <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <Input
                label="School ID"
                placeholder="e.g. 2024-00123"
                value={newStudent.schoolId}
                onChange={(e) => setNewStudent((p) => ({ ...p, schoolId: e.target.value }))}
              />
              <Input
                label="Full Name"
                placeholder="e.g. Juan Dela Cruz"
                value={newStudent.name}
                onChange={(e) => setNewStudent((p) => ({ ...p, name: e.target.value }))}
              />
              <Button padding="11px 24px" fullWidth={false}>Save Student</Button>
            </form>
          </Card>
        )}

        <AdminUsersTable users={users} onSuspend={onSuspendUser} onDelete={onDeleteUser} />
      </AdminSection>
    </>
  );
}
