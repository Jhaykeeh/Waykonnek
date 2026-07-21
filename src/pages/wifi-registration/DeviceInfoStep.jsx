import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button, StepBar } from '../../components/ui';
import Card from '../../components/Card';
import { useWifiRegistration, STEPS } from './WifiRegistrationLayout';

function InfoBox({ children }) {
  return (
    <div style={{
      padding: '12px 16px', borderRadius: '8px',
      backgroundColor: 'rgba(212,168,67,0.07)',
      border: `1px solid ${COLORS.gold.border}`,
      fontSize: '13px', color: COLORS.textMuted,
      fontFamily: FONTS.primary, lineHeight: '1.6',
    }}>
      {children}
    </div>
  );
}

export default function DeviceInfoStep() {
  const navigate = useNavigate();
  const { brand, setBrand, model, setModel, step1Errors, setStep1Errors, registeredCount, maxDevices } = useWifiRegistration();
  const [focusedField, setFocusedField] = useState(null);

  const inputStyle = (field, hasError) => ({
    width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
    border: `2px solid ${hasError ? '#e53935' : focusedField === field ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
    outline: 'none', transition: 'border-color 0.25s ease', boxSizing: 'border-box',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!brand) errs.brand = 'Please select a device brand.';
    if (!model.trim()) errs.model = 'Please enter the device model.';
    setStep1Errors(errs);
    if (Object.keys(errs).length === 0) navigate('/wifiregister/voucher');
  };

  return (
    <Card>
      {registeredCount >= maxDevices && (
        <div style={{ backgroundColor: '#FFF3E0', border: '1px solid #E65100', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', fontFamily: FONTS.primary, color: '#BF360C', lineHeight: '1.5' }}>
          <strong>⚠️ Maximum devices reached.</strong> You have already registered {maxDevices} device(s). Contact the dean's office.
        </div>
      )}
      <StepBar steps={STEPS} currentStep={1} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Device Information</h2>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
            Enter the brand and model of the device you want to connect to <strong>{APP_CONFIG.NETWORK_NAME}</strong>.
          </p>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Brand</label>
          <select value={brand} onChange={(e) => { setBrand(e.target.value); setStep1Errors((p) => ({ ...p, brand: '' })); }}
            onFocus={() => setFocusedField('brand')} onBlur={() => setFocusedField(null)}
            style={inputStyle('brand', !!step1Errors.brand)}>
            <option value="">— Select brand —</option>
            {APP_CONFIG.DEVICE_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {step1Errors.brand && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{step1Errors.brand}</p>}
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Model</label>
          <input type="text" value={model} placeholder="e.g. iPhone 14, Galaxy S23, Vivobook 15"
            onChange={(e) => { setModel(e.target.value); setStep1Errors((p) => ({ ...p, model: '' })); }}
            onFocus={() => setFocusedField('model')} onBlur={() => setFocusedField(null)}
            style={inputStyle('model', !!step1Errors.model)} />
          {step1Errors.model && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{step1Errors.model}</p>}
        </div>
        <InfoBox>
          ℹ️ You may register up to <strong>{maxDevices} devices</strong> per account.
          Your <strong>1st device</strong> is auto-approved. Your <strong>2nd device</strong> requires admin approval.
        </InfoBox>
        <Button type="submit" fullWidth padding="13px">Next: Enter Voucher →</Button>
      </form>
    </Card>
  );
}