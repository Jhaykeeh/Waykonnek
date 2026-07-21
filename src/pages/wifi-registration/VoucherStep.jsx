import { useEffect } from 'react';
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

export default function VoucherStep() {
  const navigate = useNavigate();
  const {
    brand, model, voucher, setVoucher, voucherError, setVoucherError,
    setVoucherInfo, isChecking, setIsChecking, vouchers, showToast,
  } = useWifiRegistration();

  useEffect(() => {
    if (!brand || !model) navigate('/wifiregister/deviceinfo', { replace: true });
  }, [brand, model, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucher.trim().toUpperCase();
    if (!code) { setVoucherError('Please enter your voucher code.'); return; }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const record = vouchers[code];
      if (!record) { setVoucherError('Invalid voucher code. Please check and try again.'); return; }
      if (record.uses >= record.max) {
        setVoucherError(`This voucher has already been used ${record.uses}/${record.max} times and is no longer valid.`);
        return;
      }
      setVoucherInfo({ code, uses: record.uses, max: record.max });
      showToast(`🎫 Voucher ${code} is valid — ${record.max - record.uses} use(s) remaining.`);
      navigate('/wifiregister/verify');
    }, 900);
  };

  return (
    <Card>
      <StepBar steps={STEPS} currentStep={2} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Enter Your Voucher</h2>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
            Use the voucher code issued by the CITU IT Office. Each voucher can be used a <strong>maximum of {APP_CONFIG.VOUCHER_MAX_USES} times</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(212,168,67,0.07)', border: `1px solid ${COLORS.gold.border}` }}>
          <span style={{ fontSize: '20px' }}>{brand === 'Apple' ? '📱' : '💻'}</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{brand} {model}</div>
            <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>Device to be registered</div>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Voucher Code</label>
          <input type="text" value={voucher} placeholder="e.g. CITU-2024-XXXX"
            onChange={(e) => { setVoucher(e.target.value.toUpperCase()); setVoucherError(''); }}
            style={{
              width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
              border: `2px solid ${voucherError ? '#e53935' : COLORS.gold.border}`,
              borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '16px',
              letterSpacing: '2px', textTransform: 'uppercase', outline: 'none', boxSizing: 'border-box',
            }}
            maxLength={18} />
          {voucherError && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{voucherError}</p>}
        </div>
        <InfoBox>
          🎫 Voucher usage limit: <strong>{APP_CONFIG.VOUCHER_MAX_USES} devices per voucher</strong>.<br />
          Once the limit is reached, the voucher becomes invalid.
        </InfoBox>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={() => navigate('/wifiregister/deviceinfo')}>← Back</Button>
          <Button type="submit" disabled={isChecking} fullWidth padding="13px">
            {isChecking ? 'Validating...' : 'Validate Voucher →'}
          </Button>
        </div>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
        🧪 {Object.entries(vouchers).map(([code, rec]) => `${code} (${rec.uses}/${rec.max})`).join(' · ')}
      </p>
    </Card>
  );
}