/**
 * RegisterPage Component
 * User registration page with centered card layout.
 * Collects only essential fields: schoolId, firstName, lastName, email, password.
 * Course, yearLevel, and contactNumber are set later via profile (MyAccountPage).
 */

import { useState } from 'react';
import { authService } from '../services/authService';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { Button, Input } from '../components/ui';

export default function RegisterPage({ onNavigate, onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    schoolId: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.schoolId.trim()) newErrors.schoolId = 'School ID is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFormError('');
    try {
      const data = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        schoolId: formData.schoolId,
        password: formData.password,
        email: formData.email,
      });

      const userData = data.user || data;
      onRegister({ ...formData, ...userData });
      onNavigate('dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setFormError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="register" onNavigate={onNavigate} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', backgroundColor: COLORS.bgPage,
      }}>
        <Card style={{ width: '100%', maxWidth: '560px', padding: '0' }}>
          <div style={{
            backgroundColor: COLORS.maroon.medium, padding: '24px 32px',
            borderBottom: `2px solid ${COLORS.gold.border}`, borderRadius: '12px 12px 0 0',
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, margin: 0 }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, margin: '8px 0 0 0' }}>
              Join Waykonnek-CITU and manage your campus network access
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input label="First Name" name="firstName" value={formData.firstName}
                  onChange={handleChange} error={errors.firstName} />
                <Input label="Last Name" name="lastName" value={formData.lastName}
                  onChange={handleChange} error={errors.lastName} />
              </div>

              <Input label="School ID" name="schoolId" value={formData.schoolId}
                onChange={handleChange} error={errors.schoolId} mono />

              <Input label="Email" type="email" name="email" value={formData.email}
                onChange={handleChange} error={errors.email} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input label="Password" type="password" name="password"
                  value={formData.password} onChange={handleChange} error={errors.password} />
                <Input label="Confirm Password" type="password" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms}
                  onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <span style={{ color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px' }}>
                  I agree to the{' '}
                  <span style={{ color: COLORS.text.gold, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
                </span>
              </div>
              {errors.agreeTerms && (
                <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '-10px', marginBottom: 0 }}>
                  {errors.agreeTerms}
                </p>
              )}

              {formError && (
                <div style={{
                  padding: '12px 16px', backgroundColor: 'rgba(244,67,54,0.1)',
                  border: '1px solid #F44336', borderRadius: '8px',
                  color: '#F44336', fontFamily: FONTS.primary, fontSize: '14px',
                }}>
                  {formError}
                </div>
              )}

              <Button type="submit" fullWidth disabled={isLoading} style={{ marginTop: '8px' }}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div style={{ textAlign: 'center', padding: '0 32px 32px 32px' }}>
            <p style={{ color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px', margin: 0 }}>
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')}
                style={{ background: 'none', border: 'none', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                Log in here
              </button>
            </p>
          </div>
        </Card>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
