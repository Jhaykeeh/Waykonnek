/**
 * ForgotPasswordPage Component
 * Split layout: Left branding panel + Right form panel.
 * 3-step flow: Email → OTP Verification → Reset Password → Success
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Input } from '../components/ui';

export default function ForgotPasswordPage({ onNavigate }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const stepMeta = {
    email: { title: 'Forgot Password', desc: "Enter your registered email address and we'll send you a 6-digit verification code." },
    verify: { title: 'Verify Code', desc: `A 6-digit code was sent to ${email}. Enter it below to continue.` },
    reset: { title: 'Reset Password', desc: 'Create a strong new password for your Waykonnek-CITU account.' },
    done: { title: 'Password Reset!', desc: 'Your password has been updated successfully. You can now log in with your new credentials.' },
  };

  const bullets = {
    email: ['Enter your school email', "We'll send a secure code", 'No account access needed'],
    verify: ['Check your inbox or spam', 'Code expires in 10 minutes', 'Request a new code anytime'],
    reset: ['Use 8+ characters', 'Mix letters, numbers & symbols', "Don't reuse old passwords"],
    done: ['Password updated securely', 'All sessions have been cleared', 'You can now log in'],
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep('verify'); }, 1000);
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...code];
    updated[index] = value;
    setCode(updated);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (code.some((d) => d === '')) newErrors.code = 'Please enter all 6 digits';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep('reset'); }, 1000);
  };

  const handleReset = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep('done'); }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="forgot-password" onNavigate={onNavigate} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Branding Panel */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.maroon.dark} 0%, ${COLORS.maroon.medium} 100%)`,
          padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: `2px solid ${COLORS.gold.border}`,
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>{step === 'done' ? '🔓' : '🔒'}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
            {step === 'done' ? "You're All Set!" : 'Account Recovery'}
          </h1>
          <p style={{ fontSize: '18px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6', marginBottom: '32px' }}>
            {step === 'done' ? 'Your Waykonnek-CITU account is secured with your new password.' : 'Recover access to your Waykonnek-CITU bandwidth management dashboard securely.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bullets[step].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: COLORS.text.gold, fontSize: '20px' }}>✓</span>
                <span style={{ color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '16px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ backgroundColor: COLORS.bgPage, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {['email', 'verify', 'reset', 'done'].map((s, i) => (
              <div key={s} style={{
                height: '4px', flex: 1, borderRadius: '2px',
                backgroundColor: ['email', 'verify', 'reset', 'done'].indexOf(step) >= i ? COLORS.gold.primary : COLORS.gold.border,
                transition: 'background-color 0.4s ease',
              }} />
            ))}
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '12px' }}>
            {stepMeta[step].title}
          </h2>
          <p style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary, lineHeight: '1.6', marginBottom: '32px' }}>
            {stepMeta[step].desc}
          </p>

          {step === 'email' && (
            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                error={errors.email} placeholder="juan@cit.edu" mono />
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
              <p style={{ textAlign: 'center', color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px', margin: 0 }}>
                Remembered it?{' '}
                <button type="button" onClick={() => onNavigate('login')}
                  style={{ background: 'none', border: 'none', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                  Log in
                </button>
              </p>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Verification Code</label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  {code.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      style={{
                        width: '52px', height: '60px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold',
                        backgroundColor: COLORS.bgInput, border: `1px solid ${COLORS.gold.border}`,
                        borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, outline: 'none',
                      }} />
                  ))}
                </div>
                {errors.code && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.code}</p>}
              </div>
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <p style={{ textAlign: 'center', color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px', margin: 0 }}>
                Didn't receive it?{' '}
                <button type="button" onClick={() => { setStep('email'); setCode(['', '', '', '', '', '']); setErrors({}); }}
                  style={{ background: 'none', border: 'none', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                  Resend code
                </button>
              </p>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showNew ? 'text' : 'password'} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                    style={{
                      width: '100%', padding: '11px 48px 11px 14px', backgroundColor: COLORS.bgInput,
                      border: `1px solid ${errors.newPassword ? '#e53935' : COLORS.gold.border}`,
                      borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: '18px', padding: '4px' }}>
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.newPassword && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.newPassword}</p>}
              </div>

              <div>
                <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password"
                    style={{
                      width: '100%', padding: '11px 48px 11px 14px', backgroundColor: COLORS.bgInput,
                      border: `1px solid ${errors.confirmPassword ? '#e53935' : COLORS.gold.border}`,
                      borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: '18px', padding: '4px' }}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          )}

          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                backgroundColor: COLORS.bgInput, border: `1px solid ${COLORS.gold.border}`,
                borderRadius: '8px', padding: '16px 20px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.maroon.dark}, ${COLORS.maroon.medium})`,
                  border: `2px solid ${COLORS.gold.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                }}>✓</div>
                <div>
                  <p style={{ margin: 0, fontFamily: FONTS.primary, fontWeight: 'bold', color: COLORS.textHeading, fontSize: '15px' }}>Password changed successfully</p>
                  <p style={{ margin: 0, fontFamily: FONTS.primary, color: COLORS.textBody, fontSize: '13px', marginTop: '2px' }}>Your account is now secured</p>
                </div>
              </div>
              <Button onClick={() => onNavigate('login')} fullWidth>Back to Log In</Button>
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
