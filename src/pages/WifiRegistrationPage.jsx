/**
 * WifiRegistrationPage — 4-step wizard for registering devices.
 * Uses centralized mock data and reusable UI components.
 */

import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/authService';
import { COLORS, FONTS, APP_CONFIG, getNextDeviceNumber } from '../constants/theme';
import { Button, Input, StepBar, Toast } from '../components/ui';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import { MOCK_VOUCHERS } from '../data/mockData';

const STEPS = ['Device Info', 'Voucher', 'Verify', 'Connected'];

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

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: `1px solid ${COLORS.gold.border}` }}>
      <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{label}</span>
      <span style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.mono, fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

export default function WifiRegistrationPage({ onNavigate, onLogout, userName, userRole }) {
  const [activeMenu, setActiveMenu] = useState('wifi-registration');
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [step1Errors, setStep1Errors] = useState({});

  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [deviceNo, setDeviceNo] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const [connectionStep, setConnectionStep] = useState(0);
  const [connectionDone, setConnectionDone] = useState(false);

  const [vouchers, setVouchers] = useState(MOCK_VOUCHERS);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const maxDevices = APP_CONFIG.MAX_DEVICES_PER_STUDENT;
  const inputStyle = (field, hasError) => ({
    width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
    border: `2px solid ${hasError ? '#e53935' : focusedField === field ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px', color: COLORS.maroon.card, fontFamily: FONTS.mono, fontSize: '14px',
    outline: 'none', transition: 'border-color 0.25s ease', boxSizing: 'border-box',
  });

  useEffect(() => {
    deviceService.getDevices().then((devices) => setRegisteredCount(devices.length)).catch(() => {});
  }, []);

  useEffect(() => {
    if (step !== 4 || connectionDone) return;
    if (connectionStep >= 4) {
      const t = setTimeout(() => setConnectionDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setConnectionStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, connectionStep, connectionDone]);

  const handleMenuNavigate = (key) => { setActiveMenu(key); onNavigate(key); };

  const handleStep1 = (e) => {
    e.preventDefault();
    const errs = {};
    if (!brand) errs.brand = 'Please select a device brand.';
    if (!model.trim()) errs.model = 'Please enter the device model.';
    setStep1Errors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const handleVoucherSubmit = (e) => {
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
      setStep(3);
      showToast(`🎫 Voucher ${code} is valid — ${record.max - record.uses} use(s) remaining.`);
    }, 900);
  };

  const handleConfirm = async () => {
    if (registeredCount >= maxDevices) {
      showToast(`⚠️ Maximum devices (${maxDevices}) already registered. Contact the dean's office.`, 'error');
      return;
    }
    const code = voucherInfo?.code;
    const record = code ? vouchers[code] : null;
    if (!record) { showToast('⚠️ Voucher information is missing.', 'error'); return; }

    const needsReview = record.uses >= 1;
    const nextDeviceNo = getNextDeviceNumber(registeredCount);

    setIsConnecting(true);
    try {
      await deviceService.registerDevice({ brand, model });
      const updatedUses = record.uses + 1;
      setVouchers((prev) => ({ ...prev, [code]: { ...prev[code], uses: updatedUses } }));
      setVoucherInfo((prev) => prev ? { ...prev, uses: updatedUses } : prev);
      setRegisteredCount((c) => c + 1);
      setDeviceNo(nextDeviceNo);
      setRegistrationStatus(needsReview ? 'PENDING' : 'APPROVED');

      if (needsReview) {
        const pendingReq = {
          id: Date.now(), schoolId: userName || 'student',
          name: `${brand} ${model}`, brand, model, voucherCode: code,
          deviceNo: nextDeviceNo, status: 'PENDING', submitted: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
        existing.unshift(pendingReq);
        localStorage.setItem('pending_registrations', JSON.stringify(existing));
      }

      setConnectionStep(1); setConnectionDone(false); setStep(4);

      const remaining = record.max - updatedUses;
      if (remaining === 0) {
        showToast(`✅ Voucher ${code} has reached its maximum uses (${updatedUses}/${record.max}).`, 'warning');
      } else {
        showToast(`✅ Voucher ${code} used successfully — ${remaining} use(s) remaining.`);
      }
    } catch (err) {
      showToast('❌ Registration failed. Please try again.', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleReset = () => {
    if (registeredCount >= maxDevices) return;
    setBrand(''); setModel(''); setVoucher('');
    setVoucherInfo(null); setVoucherError('');
    setStep1Errors({}); setDeviceNo(null); setRegistrationStatus(null);
    setConnectionStep(0); setConnectionDone(false);
    setStep(1);
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideIn { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes connPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes connSpin { to { transform: rotate(360deg); } }
      `}</style>
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
        <DashboardSidebar activeKey={activeMenu} onNavigate={handleMenuNavigate} onLogout={onLogout} userName={userName} userRole={userRole} />

        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
          <header style={{
            backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
            padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>📶</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>WiFi Registration</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{userName}</span>
          </header>

          <main style={{ padding: '40px', maxWidth: '640px', margin: '0 auto' }}>
            {step <= 3 && (
              <Card>
                {registeredCount >= maxDevices && (
                  <div style={{ backgroundColor: '#FFF3E0', border: '1px solid #E65100', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', fontFamily: FONTS.primary, color: '#BF360C', lineHeight: '1.5' }}>
                    <strong>⚠️ Maximum devices reached.</strong> You have already registered {maxDevices} device(s). Contact the dean's office.
                  </div>
                )}
                <StepBar steps={STEPS} currentStep={step} />

                {/* Step 1: Device Info */}
                {step === 1 && (
                  <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                )}

                {/* Step 2: Voucher */}
                {step === 2 && (
                  <form onSubmit={handleVoucherSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                        onFocus={() => setFocusedField('voucher')} onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle('voucher', !!voucherError), letterSpacing: '2px', fontSize: '16px', textTransform: 'uppercase' }}
                        maxLength={18} />
                      {voucherError && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{voucherError}</p>}
                    </div>
                    <InfoBox>
                      🎫 Voucher usage limit: <strong>{APP_CONFIG.VOUCHER_MAX_USES} devices per voucher</strong>.<br />
                      Once the limit is reached, the voucher becomes invalid.
                    </InfoBox>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                      <Button type="submit" disabled={isChecking} fullWidth padding="13px">
                        {isChecking ? 'Validating...' : 'Validate Voucher →'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: Verify */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Confirm Registration</h2>
                      <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>Please review the details below before connecting.</p>
                    </div>
                    <div style={{ backgroundColor: COLORS.bgSection, border: `1px solid ${COLORS.gold.border}`, borderRadius: '10px', padding: '4px 20px 8px' }}>
                      <SummaryRow label="Device Brand" value={brand} />
                      <SummaryRow label="Device Model" value={model} />
                      <SummaryRow label="Network" value={APP_CONFIG.NETWORK_NAME} />
                      <SummaryRow label="Voucher Code" value={voucherInfo?.code} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0' }}>
                        <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>Voucher Uses</span>
                        <span style={{ fontSize: '13px', fontFamily: FONTS.mono, fontWeight: 'bold', color: voucherInfo?.uses + 1 >= voucherInfo?.max ? '#FFC107' : '#4CAF50' }}>
                          {voucherInfo?.uses + 1} / {voucherInfo?.max} used after this
                        </span>
                      </div>
                    </div>
                    <InfoBox>
                      {voucherInfo?.uses >= 1
                        ? <>🎫 This voucher has been used <strong>{voucherInfo.uses} time(s)</strong>. This registration will be <strong>submitted for admin review</strong>.</>
                        : <>✅ This is the <strong>first use</strong> of this voucher. Your device will be <strong>auto-approved</strong>.</>}
                    </InfoBox>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                      <Button onClick={handleConfirm} disabled={isConnecting} fullWidth padding="13px"
                        style={{ backgroundColor: isConnecting ? COLORS.gold.border : voucherInfo?.uses >= 1 ? '#E65100' : COLORS.gold.primary }}>
                        {isConnecting ? 'Connecting...' : voucherInfo?.uses >= 1 ? '📨 Submit for Review' : '✓ Confirm & Connect'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Step 4: Connection Animation */}
            {step === 4 && (
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
            )}

            {step === 2 && (
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                🧪 {Object.entries(vouchers).map(([code, rec]) => `${code} (${rec.uses}/${rec.max})`).join(' · ')}
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
