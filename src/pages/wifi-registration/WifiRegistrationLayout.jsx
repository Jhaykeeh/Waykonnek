import { useState, useCallback, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Toast } from '../../components/ui';
import DashboardSidebar from '../../components/DashboardSidebar';
import { MOCK_VOUCHERS } from '../../data/mockData';

export const STEPS = ['Device Info', 'Voucher', 'Verify', 'Connected'];

export default function WifiRegistrationLayout({ onNavigate, onLogout, userName, userRole }) {
  const [activeMenu, setActiveMenu] = useState('wifi-registration');

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

  useEffect(() => {
    deviceService.getDevices().then((devices) => setRegisteredCount(devices.length)).catch(() => {});
  }, []);

  const handleMenuNavigate = (key) => { setActiveMenu(key); onNavigate(key); };

  const resetWizard = () => {
    setBrand(''); setModel(''); setVoucher('');
    setVoucherInfo(null); setVoucherError('');
    setStep1Errors({}); setDeviceNo(null); setRegistrationStatus(null);
    setConnectionStep(0); setConnectionDone(false);
  };

  const context = {
    brand, setBrand, model, setModel, step1Errors, setStep1Errors,
    voucher, setVoucher, voucherError, setVoucherError, voucherInfo, setVoucherInfo,
    isChecking, setIsChecking,
    isConnecting, setIsConnecting, registeredCount, setRegisteredCount,
    deviceNo, setDeviceNo, registrationStatus, setRegistrationStatus,
    connectionStep, setConnectionStep, connectionDone, setConnectionDone,
    vouchers, setVouchers, showToast, maxDevices, resetWizard, onNavigate,
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
            <Outlet context={context} />
          </main>
        </div>
      </div>
    </>
  );
}

export function useWifiRegistration() {
  return useOutletContext();
}