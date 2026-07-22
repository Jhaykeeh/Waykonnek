import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button } from '../ui';

export default function ConnectionStep({ onNavigate, registeredCount, maxDevices }) {
  const navigate = useNavigate();
  const brand = localStorage.getItem('wifi_reg_brand') || '';
  const model = localStorage.getItem('wifi_reg_model') || '';
  const deviceNo = localStorage.getItem('wifi_reg_device_no') || '';
  const registrationStatus = localStorage.getItem('wifi_reg_status') || '';
  const voucherInfo = (() => {
    const saved = localStorage.getItem('wifi_reg_voucher_info');
    return saved ? JSON.parse(saved) : null;
  })();

  const [connectionStep, setConnectionStep] = useState(0);
  const [connectionDone, setConnectionDone] = useState(false);

  useEffect(() => {
    if (connectionDone) return;
    if (connectionStep >= 4) {
      const t = setTimeout(() => setConnectionDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setConnectionStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [connectionStep, connectionDone]);

  const onReset = () => {
    if (registeredCount >= maxDevices) return;
    
    // Clear localStorage
    localStorage.removeItem('wifi_reg_brand');
    localStorage.removeItem('wifi_reg_model');
    localStorage.removeItem('wifi_reg_voucher');
    localStorage.removeItem('wifi_reg_voucher_info');
    localStorage.removeItem('wifi_reg_device_no');
    localStorage.removeItem('wifi_reg_status');

    navigate('/wifi-registration/Device Info');
  };

  if (!connectionDone) {
    const items = [
      { icon: '...', text: 'Scanning network...' },
      { icon: '...', text: 'Verifying voucher...' },
      { icon: '...', text: 'Assigning IP address...' },
      { icon: '...', text: `Connecting to ${APP_CONFIG.NETWORK_NAME}...` },
      { icon: registrationStatus === 'PENDING' ? '...' : 'OK', text: registrationStatus === 'PENDING' ? 'Request submitted!' : 'Connected!' },
    ];
    return (
      <>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${COLORS.gold.border}`, borderTopColor: COLORS.gold.primary, margin: '0 auto 20px', animation: 'connSpin 0.8s linear infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px', margin: '0 auto 12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '8px',
              backgroundColor: connectionStep > i ? 'rgba(76,175,80,0.1)' : connectionStep === i ? 'rgba(212,168,67,0.12)' : 'transparent',
              border: `1px solid ${connectionStep > i ? 'rgba(76,175,80,0.3)' : connectionStep === i ? COLORS.gold.border : 'transparent'}`,
              opacity: connectionStep >= i ? 1 : 0.3, transition: 'all 0.4s ease',
            }}>
              <span style={{ fontSize: '20px', animation: connectionStep === i ? 'connPulse 1s ease infinite' : 'none' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontFamily: FONTS.primary, color: connectionStep > i ? '#4CAF50' : connectionStep === i ? COLORS.text.gold : COLORS.textMuted, fontWeight: connectionStep >= i ? 'bold' : 'normal' }}>{item.text}</span>
              {connectionStep > i && <span style={{ marginLeft: 'auto', color: '#4CAF50', fontSize: '16px' }}>✓</span>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono, marginTop: '8px' }}>
          {connectionStep < 4 ? `Step ${connectionStep} of 4` : 'Finalizing...'}
        </p>
      </>
    );
  }

  return (
    <>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: registrationStatus === 'PENDING' ? 'rgba(255,193,7,0.15)' : 'rgba(76,175,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `3px solid ${registrationStatus === 'PENDING' ? '#FFC107' : '#4CAF50'}` }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: registrationStatus === 'PENDING' ? '#FFC107' : '#4CAF50', fontFamily: FONTS.primary }}>{registrationStatus === 'PENDING' ? 'PEND' : 'DONE'}</span>
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '10px' }}>
        {registrationStatus === 'PENDING' ? 'Submitted for Admin Review' : 'Device Registered!'}
      </h2>
      <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, lineHeight: '1.7', marginBottom: '28px' }}>
        {registrationStatus === 'PENDING'
          ? <>Your <strong style={{ color: COLORS.textBody }}>{brand} {model}</strong> (Device #{deviceNo}) has been submitted for admin review.</>
          : <>Your <strong style={{ color: COLORS.textBody }}>{brand} {model}</strong> (Device #{deviceNo}) is now connected to <strong style={{ color: COLORS.textBody }}>{APP_CONFIG.NETWORK_NAME}</strong>.</>}
        <br />
        Voucher <strong style={{ color: COLORS.textBody, fontFamily: FONTS.mono }}>{voucherInfo?.code}</strong> has been used ({voucherInfo?.uses}/{voucherInfo?.max}).
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {[
          { icon: 'NET', label: APP_CONFIG.NETWORK_NAME },
          { icon: 'BW', label: `${APP_CONFIG.MONTHLY_BANDWIDTH_CAP_GB} GB / month` },
          { icon: 'ENC', label: 'Encrypted' },
          { icon: 'DEV', label: `${brand} ${model}` },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', backgroundColor: COLORS.bgSection, border: `1px solid ${COLORS.gold.border}`, borderRadius: '20px', fontSize: '12px', color: COLORS.textBody, fontFamily: FONTS.primary }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, backgroundColor: 'rgba(212,168,67,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {registeredCount < maxDevices && <Button variant="secondary" onClick={onReset}>Register Another Device</Button>}
        <Button onClick={() => onNavigate('dashboard')} padding="12px 28px">Go to Dashboard →</Button>
      </div>
    </>
  );
}