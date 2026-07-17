/**
 * MyAccount Component
 * Account management page with profile info, password change, and notification preferences.
 */

import { useState, useEffect } from 'react';
import { authService, userService } from '../services/authService';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import logo from '../assets/waykonnek.png';
import { Button, Input, Toggle, SectionHeading } from '../components/ui';

export default function MyAccount({ onNavigate, onLogout, onUpdateUser, userName, user }) {
  const [activeMenu, setActiveMenu] = useState('my-account');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    studentId: user?.schoolId || '',
    course: user?.course || '',
    year: user?.year || '',
    contactNumber: user?.contactNumber || '',
  });

  const [profileDraft, setProfileDraft] = useState({ ...profile });

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) {
      const p = {
        firstName: u.firstName || u.schoolId || userName || 'User',
        lastName: u.lastName || '',
        email: u.email || '',
        studentId: u.schoolId || u.studentId || userName || '',
        course: u.course || '',
        year: u.year || '',
        contactNumber: u.contactNumber || '',
      };
      setProfile(p);
      setProfileDraft(p);
    }

    userService.getProfile()
      .then((response) => {
        const data = response.user || response;
        if (data) {
          const apiData = {};
          if (data.firstName) apiData.firstName = data.firstName;
          if (data.lastName) apiData.lastName = data.lastName;
          if (data.email) apiData.email = data.email;
          if (data.schoolId || data.studentId) apiData.schoolId = data.schoolId || data.studentId;
          if (data.course) apiData.course = data.course;
          if (data.year) apiData.year = data.year;
          if (data.contactNumber) apiData.contactNumber = data.contactNumber;

          setProfile((prev) => {
            const newProfile = { ...prev, ...apiData, studentId: apiData.schoolId || prev.studentId };
            if (!editingProfile) setProfileDraft(newProfile);
            return newProfile;
          });

          if (onUpdateUser && Object.keys(apiData).length > 0) onUpdateUser(apiData);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [userName]);

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const [notifications, setNotifications] = useState({
    bandwidthAlerts: true,
    deviceConnects: true,
    systemUpdates: false,
    loginAlerts: true,
  });

  const notificationLabels = {
    bandwidthAlerts: { label: 'Bandwidth Alerts', desc: 'Notify when you reach 80% of your daily allocation' },
    deviceConnects: { label: 'Device Connections', desc: 'Notify when a new device connects to your account' },
    systemUpdates: { label: 'System Updates', desc: 'Receive notifications about system maintenance and updates' },
    loginAlerts: { label: 'Login Alerts', desc: 'Notify on successful logins to your account' },
  };

  const handleMenuNavigate = (key) => {
    if (key === 'my-account') { setActiveMenu(key); return; }
    onNavigate('dashboard');
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      await userService.updateProfile({
        firstName: profileDraft.firstName, lastName: profileDraft.lastName,
        email: profileDraft.email, course: profileDraft.course,
        year: profileDraft.year, contactNumber: profileDraft.contactNumber,
      });
      setProfile({ ...profileDraft });
      setEditingProfile(false);
      setSuccessMsg('Profile updated successfully!');
    } catch {
      setSuccessMsg('Failed to update profile.');
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handlePasswordSave = () => {
    if (passwords.newPass !== passwords.confirm) { alert('New passwords do not match.'); return; }
    setSavingPassword(true);
    setTimeout(() => {
      setPasswords({ current: '', newPass: '', confirm: '' });
      setEditingPassword(false);
      setSavingPassword(false);
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const profileFields = [
    { field: 'firstName', label: 'First Name' },
    { field: 'lastName', label: 'Last Name' },
    { field: 'email', label: 'Email Address' },
    { field: 'studentId', label: 'Student ID', readOnly: true },
    { field: 'course', label: 'Course' },
    { field: 'year', label: 'Year Level' },
    { field: 'contactNumber', label: 'Contact Number' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      <DashboardSidebar activeKey={activeMenu} onNavigate={handleMenuNavigate} onLogout={onLogout} userName={userName} />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        <header style={{
          backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="Waykonnek-CITU" style={{ height: '32px', width: 'auto', borderRadius: '6px' }} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>Waykonnek-CITU</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Welcome back,</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{userName}</span>
          </div>
        </header>

        <main style={{ padding: '40px' }}>
          {/* Profile Banner */}
          <Card style={{
            marginBottom: '32px',
            background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', fontWeight: 'bold', color: COLORS.maroon.dark, fontFamily: FONTS.primary,
                flexShrink: 0, border: `3px solid ${COLORS.gold.primary}`,
              }}>
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary, margin: '0 0 2px 0' }}>
                  {(profile.course || 'Course not set')} · {(profile.year || 'Year not set')}
                </p>
                <p style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, margin: 0 }}>
                  Student ID: {profile.studentId}
                </p>
              </div>
            </div>
          </Card>

          {loadingProfile && (
            <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '-20px 0 24px' }}>
              Loading profile details...
            </p>
          )}

          {successMsg && (
            <div style={{
              marginBottom: '24px', padding: '14px 20px',
              backgroundColor: 'rgba(76,175,80,0.15)', border: '1px solid #4CAF50',
              borderRadius: '10px', color: '#4CAF50', fontFamily: FONTS.primary, fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Profile Information */}
          <SectionHeading icon="👤">Profile Information</SectionHeading>
          <Card style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary }}>Personal Details</span>
              {!editingProfile ? (
                <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" onClick={() => { setProfileDraft({ ...profile }); setEditingProfile(false); }}>Cancel</Button>
                  <Button onClick={handleProfileSave} disabled={savingProfile}>
                    {savingProfile ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {profileFields.map(({ field, label, readOnly }) => (
                <div key={field}>
                  <label style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                    {label}
                  </label>
                  {editingProfile && !readOnly ? (
                    <Input value={profileDraft[field]} mono={field === 'studentId'}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, [field]: e.target.value }))} />
                  ) : (
                    <div style={{ fontSize: '15px', color: COLORS.textBody, fontFamily: FONTS.primary, padding: '10px 0', borderBottom: `1px solid rgba(212,168,67,0.15)` }}>
                      {profile[field] || '—'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Change Password */}
          <SectionHeading icon="🔒">Security</SectionHeading>
          <Card style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary }}>Change Password</span>
              {!editingPassword ? (
                <Button onClick={() => setEditingPassword(true)}>Change Password</Button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" onClick={() => { setEditingPassword(false); setPasswords({ current: '', newPass: '', confirm: '' }); }}>Cancel</Button>
                  <Button onClick={handlePasswordSave} disabled={savingPassword}>
                    {savingPassword ? 'Saving…' : 'Update Password'}
                  </Button>
                </div>
              )}
            </div>
            {!editingPassword ? (
              <p style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary, margin: 0 }}>
                Your password was last changed 30 days ago. We recommend updating it regularly.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Current Password" type="password" value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} placeholder="Enter current password" />
                </div>
                <Input label="New Password" type="password" value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))} placeholder="Enter new password" />
                <Input label="Confirm New Password" type="password" value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="Confirm new password" />
              </div>
            )}
          </Card>

          {/* Notification Preferences */}
          <SectionHeading icon="🔔">Notification Preferences</SectionHeading>
          <Card style={{ padding: '0' }}>
            {Object.entries(notificationLabels).map(([key, { label, desc }], idx, arr) => (
              <div key={key} style={{
                padding: '20px 24px',
                borderBottom: idx < arr.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary, marginBottom: '4px' }}>{label}</div>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0, lineHeight: '1.5' }}>{desc}</p>
                </div>
                <Toggle enabled={notifications[key]} onToggle={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} />
              </div>
            ))}
          </Card>

          {/* Account Actions */}
          <SectionHeading icon="⚡" style={{ marginTop: '32px' }}>Account Actions</SectionHeading>
          <Card>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={onLogout}>Sign Out</Button>
              <Button variant="secondary" style={{ color: '#e57373', borderColor: '#e57373' }}>Delete Account</Button>
            </div>
            <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '12px', marginBottom: 0 }}>
              Deleting your account is permanent and will remove all your data, registered devices, and usage history.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
