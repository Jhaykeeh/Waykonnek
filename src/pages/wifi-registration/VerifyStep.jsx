import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { COLORS, FONTS, APP_CONFIG, getNextDeviceNumber } from '../../constants/theme';
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

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: `1px solid ${COLORS.gold.border}` }}>
      <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{label}</span>
      <span style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.mono, fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

export default function VerifyStep() {
  const navigate = useNavigate();
  const {
    brand, model, voucherInfo, setVoucherInfo, vouchers, setVouchers,
    isConnecting, setIsConnecting, registeredCount, setRegisteredCount,
    maxDevices, setDeviceNo, setRegistrationStatus, setConnectionStep,
    setConnectionDone, showToast,
  } = useWifiRegistration();

  useEffect(() => {
    if (!voucherInfo) navigate('/wifiregister/voucher', { replace: true });
  }, [voucherInfo, navigate]);

  if (!voucherInfo) return null;

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
          id: Date.now(), schoolId: 'student',
          name: `${brand} ${model}`, brand, model, voucherCode: code,
          deviceNo: nextDeviceNo, status: 'PENDING', submitted: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
        existing.unshift(pendingReq);
        localStorage.setItem('pending_registrations', JSON.stringify(existing));
      }

      setConnectionStep(1);
      setConnectionDone(false);

      const remaining = record.max - updatedUses;
      if (remaining === 0) {
        showToast(`✅ Voucher ${code} has reached its maximum uses (${updatedUses}/${record.max}).`, 'warning');
      } else {
        showToast(`✅ Voucher ${code} used successfully — ${remaining} use(s) remaining.`);
      }
      navigate('/wifiregister/connected');
    } catch (err) {
      showToast('❌ Registration failed. Please try again.', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <StepBar steps={STEPS} currentStep={3} />
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
          <Button variant="secondary" onClick={() => navigate('/wifiregister/voucher')}>← Back</Button>
          <Button onClick={handleConfirm} disabled={isConnecting} fullWidth padding="13px"
            style={{ backgroundColor: isConnecting ? COLORS.gold.border : voucherInfo?.uses >= 1 ? '#E65100' : COLORS.gold.primary }}>
            {isConnecting ? 'Connecting...' : voucherInfo?.uses >= 1 ? '📨 Submit for Review' : '✓ Confirm & Connect'}
          </Button>
        </div>
      </div>
    </Card>
  );
}