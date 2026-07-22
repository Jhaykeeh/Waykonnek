import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button } from '../ui';
import InfoBox from './InfoBox';

export default function VoucherStep({ showToast }) {
  const navigate = useNavigate();
  const brand = localStorage.getItem('wifi_reg_brand') || '';
  const model = localStorage.getItem('wifi_reg_model') || '';

  const [voucher, setVoucher] = useState(() => localStorage.getItem('wifi_reg_voucher') || '');
  const [voucherError, setVoucherError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const vouchers = {
    'CITU-2024-AAAA': { uses: 0, max: 2 },
    'CITU-2024-BBBB': { uses: 0, max: 2 },
    'CITU-2024-CCCC': { uses: 0, max: 2 },
    'CITU-2024-DDDD': { uses: 0, max: 2 },
  };

  useEffect(() => {
    localStorage.setItem('wifi_reg_voucher', voucher);
  }, [voucher]);

  const inputStyle = (field, hasError) => ({
    width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
    border: `2px solid ${hasError ? '#e53935' : focusedField === field ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
    outline: 'none', transition: 'border-color 0.25s ease', boxSizing: 'border-box',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucher.trim().toUpperCase();
    if (!code) { setVoucherError('Please enter your voucher code.'); return; }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const savedVouchers = JSON.parse(localStorage.getItem('wifi_vouchers') || JSON.stringify(vouchers));
      const record = savedVouchers[code];
      if (!record) { setVoucherError('Invalid voucher code. Please check and try again.'); return; }
      if (record.uses >= record.max) {
        setVoucherError(`This voucher has already been used ${record.uses}/${record.max} times and is no longer valid.`);
        return;
      }
      
      const vInfo = { code, uses: record.uses, max: record.max };
      localStorage.setItem('wifi_reg_voucher_info', JSON.stringify(vInfo));
      navigate('/wifi-registration/Device Info/Voucher/Verify');
      if (showToast) showToast(`Voucher ${code} is valid - ${record.max - record.uses} use(s) remaining.`);
    }, 900);
  };

  const onBack = () => {
    navigate('/wifi-registration/Device Info');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Enter Your Voucher</h2>
        <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
          Use the voucher code issued by the CITU IT Office. Each voucher can be used a <strong>maximum of {APP_CONFIG.VOUCHER_MAX_USES} times</strong>.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(212,168,67,0.07)', border: `1px solid ${COLORS.gold.border}` }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: brand === 'Apple' ? 'rgba(212,168,67,0.15)' : 'rgba(100,100,100,0.1)', border: `1px solid ${brand === 'Apple' ? COLORS.gold.border : 'rgba(100,100,100,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: brand === 'Apple' ? COLORS.text.gold : COLORS.textMuted, fontFamily: FONTS.primary }}>{brand === 'Apple' ? 'iOS' : 'DEV'}</span>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{brand} {model}</div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>Device to be registered</div>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Voucher Code</label>
        <input type="text" value={voucher} placeholder="e.g. CITU-2024-XXXX"
          onChange={(e) => { setVoucher(e.target.value.toUpperCase()); setVoucherError(''); }}
          onFocus={() => setFocusedField('voucher')} onBlur={() => setFocusedField(null)}
          style={{ ...inputStyle('voucher', !!voucherError), letterSpacing: '2px', fontSize: '16px', textTransform: 'uppercase' }}
          maxLength={18} />
        {voucherError && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{voucherError}</p>}
      </div>
      <InfoBox>
        Voucher usage limit: <strong>{APP_CONFIG.VOUCHER_MAX_USES} devices per voucher</strong>.<br />
        Once the limit is reached, the voucher becomes invalid.
      </InfoBox>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button type="submit" disabled={isChecking} fullWidth padding="13px">
          {isChecking ? 'Validating...' : 'Validate Voucher →'}
        </Button>
      </div>
    </form>
  );
}