/**
 * WifiRegistrationPage — 4-step wizard for registering devices.
 * Step UI lives in components/wifi/*; this file owns state + handlers.
 */

import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/deviceService';
import { COLORS, FONTS, APP_CONFIG, getNextDeviceNumber } from '../constants/theme';
import { StepBar, Toast } from '../components/ui';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import { MOCK_VOUCHERS } from '../data/mockData';
import DeviceInfoStep from '../components/wifi/DeviceInfoStep';
import VoucherStep from '../components/wifi/VoucherStep';
import VerifyStep from '../components/wifi/VerifyStep';
import ConnectionStep from '../components/wifi/ConnectionStep';

const STEPS = ['Device Info', 'Voucher', 'Verify', 'Connected'];

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

  const [vouchers, setVouchers] = useState({
    'CITU-2024-AAAA': { uses: 0, max: 2 },
    'CITU-2024-BBBB': { uses: 0, max: 2 },
    'CITU-2024-CCCC': { uses: 0, max: 2 },
    'CITU-2024-DDDD': { uses: 0, max: 2 },
  });
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
      showToast(`Voucher ${code} is valid - ${record.max - record.uses} use(s) remaining.`);
    }, 900);
  };

  const handleConfirm = async () => {
    if (registeredCount >= maxDevices) {
      showToast(`Maximum devices (${maxDevices}) already registered. Contact the dean's office.`, 'error');
      return;
    }
    const code = voucherInfo?.code;
    const record = code ? vouchers[code] : null;
    if (!record) { showToast('Voucher information is missing.', 'error'); return; }

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
        showToast(`Voucher ${code} has reached its maximum uses (${updatedUses}/${record.max}).`, 'warning');
      } else {
        showToast(`Voucher ${code} used successfully - ${remaining} use(s) remaining.`);
      }
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
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
              <span style={{ fontSize: '26px', color: COLORS.text.gold, fontFamily: FONTS.primary }}>WiFi</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>WiFi Registration</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{userName}</span>
          </header>

          <main style={{ padding: '40px', maxWidth: '640px', margin: '0 auto' }}>
            {step <= 3 && (
              <Card>
                {registeredCount >= maxDevices && (
                  <div style={{ backgroundColor: '#FFF3E0', border: '1px solid #E65100', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', fontFamily: FONTS.primary, color: '#BF360C', lineHeight: '1.5' }}>
                    <strong>Maximum devices reached.</strong> You have already registered {maxDevices} device(s). Contact the dean's office.
                  </div>
                )}
                <StepBar steps={STEPS} currentStep={step} />

                {step === 1 && (
                  <DeviceInfoStep
                    brand={brand} model={model} setBrand={setBrand} setModel={setModel}
                    errors={step1Errors} setErrors={setStep1Errors}
                    focusedField={focusedField} setFocusedField={setFocusedField}
                    inputStyle={inputStyle} maxDevices={maxDevices} APP_CONFIG={APP_CONFIG}
                    onSubmit={handleStep1}
                  />
                )}

                {step === 2 && (
                  <VoucherStep
                    brand={brand} model={model}
                    voucher={voucher} setVoucher={setVoucher}
                    voucherError={voucherError} setVoucherError={setVoucherError}
                    isChecking={isChecking} APP_CONFIG={APP_CONFIG}
                    focusedField={focusedField} setFocusedField={setFocusedField}
                    inputStyle={inputStyle}
                    onSubmit={handleVoucherSubmit}
                    onBack={() => setStep(1)}
                  />
                )}

                {step === 3 && (
                  <VerifyStep
                    brand={brand} model={model} voucherInfo={voucherInfo}
                    isConnecting={isConnecting} APP_CONFIG={APP_CONFIG}
                    onConfirm={handleConfirm}
                    onBack={() => setStep(2)}
                  />
                )}
              </Card>
            )}

            {step === 4 && (
              <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
                <ConnectionStep
                  connectionStep={connectionStep} connectionDone={connectionDone}
                  registrationStatus={registrationStatus}
                  brand={brand} model={model} deviceNo={deviceNo} voucherInfo={voucherInfo}
                  APP_CONFIG={APP_CONFIG}
                  registeredCount={registeredCount} maxDevices={maxDevices}
                  onReset={handleReset} onNavigate={onNavigate}
                />
              </Card>
            )}

          </main>
        </div>
      </div>
    </>
  );
}