import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deviceService } from '../services/deviceService';
import { COLORS, FONTS, APP_CONFIG } from '../constants/theme';
import { StepBar, Toast } from '../components/ui';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import DeviceInfoStep from '../components/wifi/DeviceInfoStep';
import VoucherStep from '../components/wifi/VoucherStep';
import VerifyStep from '../components/wifi/VerifyStep';
import ConnectionStep from '../components/wifi/ConnectionStep';

const STEPS = ['Device Info', 'Voucher', 'Verify', 'Connected'];

export default function WifiRegistrationPage({ onNavigate, onLogout, userName, userRole }) {
  const [activeMenu, setActiveMenu] = useState('wifi-registration');
  const location = useLocation();
  const navigateRouter = useNavigate();
  const [registeredCount, setRegisteredCount] = useState(0);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const maxDevices = APP_CONFIG.MAX_DEVICES_PER_STUDENT;

  // Load count of registered devices
  useEffect(() => {
    deviceService.getDevices().then((devices) => setRegisteredCount(devices.length)).catch(() => {});
  }, []);

  const decodedPath = decodeURIComponent(location.pathname);
  let step = 1;
  if (
    decodedPath.endsWith('/Device Info/Voucher/Verify/connected') || 
    decodedPath.endsWith('/Device Info/Voucher/Verify//connected') ||
    decodedPath.includes('/Verify//connected')
  ) {
    step = 4;
  } else if (decodedPath.endsWith('/Device Info/Voucher/Verify')) {
    step = 3;
  } else if (decodedPath.endsWith('/Device Info/Voucher')) {
    step = 2;
  } else {
    step = 1;
  }

  // Route guards
  useEffect(() => {
    const decodedPath = decodeURIComponent(location.pathname);
    const cleanPath = decodedPath.endsWith('/') ? decodedPath.slice(0, -1) : decodedPath;

    if (cleanPath === '/wifi-registration') {
      navigateRouter('/wifi-registration/Device Info', { replace: true });
      return;
    }

    const brand = localStorage.getItem('wifi_reg_brand');
    const model = localStorage.getItem('wifi_reg_model');
    const voucherInfo = localStorage.getItem('wifi_reg_voucher_info');

    if (
      cleanPath.endsWith('/Device Info/Voucher/Verify/connected') || 
      cleanPath.endsWith('/Device Info/Voucher/Verify//connected') ||
      cleanPath.includes('/Verify//connected')
    ) {
      if (!brand || !model || !voucherInfo) {
        navigateRouter('/wifi-registration/Device Info', { replace: true });
      }
    } else if (cleanPath.endsWith('/Device Info/Voucher/Verify')) {
      if (!brand || !model || !voucherInfo) {
        navigateRouter('/wifi-registration/Device Info/Voucher', { replace: true });
      }
    } else if (cleanPath.endsWith('/Device Info/Voucher')) {
      if (!brand || !model) {
        navigateRouter('/wifi-registration/Device Info', { replace: true });
      }
    }
  }, [location.pathname, navigateRouter]);

  const handleMenuNavigate = (key) => { setActiveMenu(key); onNavigate(key); };

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

                {step === 1 && <DeviceInfoStep maxDevices={maxDevices} />}

                {step === 2 && <VoucherStep showToast={showToast} />}

                {step === 3 && (
                  <VerifyStep
                    userName={userName}
                    registeredCount={registeredCount}
                    setRegisteredCount={setRegisteredCount}
                    showToast={showToast}
                  />
                )}
              </Card>
            )}

            {step === 4 && (
              <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
                <ConnectionStep
                  onNavigate={onNavigate}
                  registeredCount={registeredCount}
                  setRegisteredCount={setRegisteredCount}
                  maxDevices={maxDevices}
                />
              </Card>
            )}

          </main>
        </div>
      </div>
    </>
  );
}