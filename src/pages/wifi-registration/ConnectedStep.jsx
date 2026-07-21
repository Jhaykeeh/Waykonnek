import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button } from '../../components/ui';
import Card from '../../components/Card';
import { useWifiRegistration } from './WifiRegistrationLayout';

export default function ConnectedStep() {
  const navigate = useNavigate();
  const {
    brand, model, voucherInfo, deviceNo, registrationStatus,
    connectionStep, setConnectionStep, connectionDone, setConnectionDone,
    registeredCount, maxDevices, resetWizard, onNavigate,
  } = useWifiRegistration();

  useEffect(() => {
    if (!registrationStatus) navigate('/wifiregister/deviceinfo', { replace: true });
  }, [registrationStatus, navigate]);

  useEffect(() => {
    if (connectionDone) return;
    if (connectionStep >= 4) {
      const t = setTimeout(() => setConnectionDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setConnectionStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [connectionStep, connectionDone, setConnectionStep, setConnectionDone]);

  if (!registrationStatus) return null;

  const handleReset = () => {
    if (registeredCount >= maxDevices) return;
    resetWizard();
    navigate('/wifiregister/deviceinfo');
  };

  return (
    <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
      {!connectionDone ? (
        <>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${COLORS.gold.border}`, borderTopColor: COLORS.gold.primary, margin: '0 auto 20px', animation: 'connSpin 0.8s linear infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px', margin: '0 auto 12px' }}>
            {[
              { icon: '🔍', text: 'Scanning network...' },
              { icon: '🎫', text: 'Verifying voucher...' },
              { icon: '📡', text: 'Assigning IP address...' },
              { icon: '🔗', text: `Connecting to ${APP_CONFIG.NETWORK_NAME}...` },
              { icon: registrationStatus === 'PENDING' ? '📨' : '✅', text: registrationStatus === 'PENDING' ? 'Request submitted!' : 'Connected!' },
            ].map((item, i) => (
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
      ) : (
        <>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{registrationStatus === 'PENDING' ? '⏳' : '✅'}</div>
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
              { icon: '📶', label: APP_CONFIG.NETWORK_NAME },
              { icon: '⚡', label: `${APP_CONFIG.MONTHLY_BANDWIDTH_CAP_GB} GB / month` },
              { icon: '🔒', label: 'Encrypted' },
              { icon: '📱', label: `${brand} ${model}` },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: COLORS.bgSection, border: `1px solid ${COLORS.gold.border}`, borderRadius: '20px', fontSize: '12px', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                {icon} {label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {registeredCount < maxDevices && <Button variant="secondary" onClick={handleReset}>Register Another Device</Button>}
            <Button onClick={() => onNavigate('dashboard')} padding="12px 28px">Go to Dashboard →</Button>
          </div>
        </>
      )}
    </Card>
  );
}