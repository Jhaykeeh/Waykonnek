import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button } from '../ui';
import InfoBox from './InfoBox';

export default function DeviceInfoStep({ maxDevices }) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState(() => localStorage.getItem('wifi_reg_brand') || '');
  const [model, setModel] = useState(() => localStorage.getItem('wifi_reg_model') || '');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    localStorage.setItem('wifi_reg_brand', brand);
  }, [brand]);

  useEffect(() => {
    localStorage.setItem('wifi_reg_model', model);
  }, [model]);

  const inputStyle = (field, hasError) => ({
    width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
    border: `2px solid ${hasError ? '#e53935' : focusedField === field ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
    outline: 'none', transition: 'border-color 0.25s ease', boxSizing: 'border-box',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!brand) errs.brand = 'Please select a device brand.';
    if (!model.trim()) errs.model = 'Please enter the device model.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      navigate('/wifi-registration/Device Info/Voucher');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Device Information</h2>
        <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
          Enter the brand and model of the device you want to connect to <strong>{APP_CONFIG.NETWORK_NAME}</strong>.
        </p>
      </div>
      <div>
        <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Brand</label>
        <select value={brand} onChange={(e) => { setBrand(e.target.value); setErrors((p) => ({ ...p, brand: '' })); }}
          onFocus={() => setFocusedField('brand')} onBlur={() => setFocusedField(null)}
          style={inputStyle('brand', !!errors.brand)}>
          <option value="">— Select brand —</option>
          {APP_CONFIG.DEVICE_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.brand && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.brand}</p>}
      </div>
      <div>
        <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Model</label>
        <input type="text" value={model} placeholder="e.g. iPhone 14, Galaxy S23, Vivobook 15"
          onChange={(e) => { setModel(e.target.value); setErrors((p) => ({ ...p, model: '' })); }}
          onFocus={() => setFocusedField('model')} onBlur={() => setFocusedField(null)}
          style={inputStyle('model', !!errors.model)} />
        {errors.model && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.model}</p>}
      </div>
      <InfoBox>
        You may register up to <strong>{maxDevices} devices</strong> per account.
        Your <strong>1st device</strong> is auto-approved. Your <strong>2nd device</strong> requires admin approval.
      </InfoBox>
      <Button type="submit" fullWidth padding="13px">Next: Enter Voucher →</Button>
    </form>
  );
}