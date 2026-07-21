/**
 * LoginPage Component
 * Split layout: Left branding panel + Right form panel.
 */

import { useState } from 'react';
import { authService } from '../services/authService';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Input } from '../components/ui';

export default function LoginPage({ onNavigate, onLogin }) {
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!schoolId.trim()) newErrors.schoolId = 'School ID is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFormError('');
    try {
      const data = await authService.login({ schoolId, password });
      onLogin(data);
      const loginRole = data.user?.role || data.role;
      if (loginRole === 'ADMIN') {
        onNavigate('admin-panel');
      } else {
        onNavigate('dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setFormError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="login" onNavigate={onNavigate} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Branding Panel */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.maroon.dark} 0%, ${COLORS.maroon.medium} 100%)`,
          padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: `2px solid ${COLORS.gold.border}`,
        }}>
          
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
            Welcome Back to Waykonnek-CITU
          </h1>
          <p style={{ fontSize: '18px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6', marginBottom: '32px' }}>
            Access your bandwidth management dashboard and monitor your network usage in real-time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Real-time bandwidth monitoring', 'Device management', 'Usage reports & analytics'].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: COLORS.text.gold, fontSize: '20px' }}>✓</span>
                <span style={{ color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '16px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          backgroundColor: COLORS.bgPage, padding: '60px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
            Log In
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formError && (
              <div style={{
                padding: '12px 16px', backgroundColor: 'rgba(244,67,54,0.1)',
                border: '1px solid #F44336', borderRadius: '8px',
                color: '#F44336', fontFamily: FONTS.primary, fontSize: '14px',
              }}>
                {formError}
              </div>
            )}

            <Input label="School ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}
              error={errors.schoolId} mono />

            <div>
              <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 48px 11px 14px', backgroundColor: COLORS.bgInput,
                    border: `1px solid ${errors.password ? '#e53935' : COLORS.gold.border}`,
                    borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box',
                  }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: '18px', padding: '4px',
                  }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={() => onNavigate('forgot-password')}
                style={{ background: 'none', border: 'none', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px' }}>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')}
              style={{ background: 'none', border: 'none', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
              Register here
            </button>
          </p>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
