import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS, APP_CONFIG, getNextDeviceNumber } from '../../constants/theme';
import { deviceService } from '../../services/deviceService';
import { Button } from '../ui';
import InfoBox from './InfoBox';
import SummaryRow from './SummaryRow';

export default function VerifyStep({ userName, registeredCount, setRegisteredCount, showToast }) {
  const navigate = useNavigate();
  const brand = localStorage.getItem('wifi_reg_brand') || '';
  const model = localStorage.getItem('wifi_reg_model') || '';
  const [isConnecting, setIsConnecting] = useState(false);

  const voucherInfo = (() => {
    const saved = localStorage.getItem('wifi_reg_voucher_info');
    return saved ? JSON.parse(saved) : null;
  })();

  const handleConfirm = async () => {
    const maxDevices = APP_CONFIG.MAX_DEVICES_PER_STUDENT;
    if (registeredCount >= maxDevices) {
      if (showToast) showToast(`Maximum devices (${maxDevices}) already registered. Contact the dean's office.`, 'error');
      return;
    }
    const code = voucherInfo?.code;
    if (!code) { if (showToast) showToast('Voucher information is missing.', 'error'); return; }

    const needsReview = voucherInfo.uses >= 1;
    const nextDeviceNo = getNextDeviceNumber(registeredCount);

    setIsConnecting(true);
    try {
      await deviceService.registerDevice({ brand, model });
      
      const defaultVouchers = {
        'CITU-2024-AAAA': { uses: 0, max: 2 },
        'CITU-2024-BBBB': { uses: 0, max: 2 },
        'CITU-2024-CCCC': { uses: 0, max: 2 },
        'CITU-2024-DDDD': { uses: 0, max: 2 },
      };
      const savedVouchers = JSON.parse(localStorage.getItem('wifi_vouchers') || JSON.stringify(defaultVouchers));
      if (savedVouchers[code]) {
        savedVouchers[code].uses += 1;
        localStorage.setItem('wifi_vouchers', JSON.stringify(savedVouchers));
      }
      
      const updatedUses = voucherInfo.uses + 1;
      const updatedVInfo = { ...voucherInfo, uses: updatedUses };
      localStorage.setItem('wifi_reg_voucher_info', JSON.stringify(updatedVInfo));
      localStorage.setItem('wifi_reg_device_no', nextDeviceNo);
      localStorage.setItem('wifi_reg_status', needsReview ? 'PENDING' : 'APPROVED');

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

      setRegisteredCount(c => c + 1);
      navigate('/wifi-registration/Device Info/Voucher/Verify//connected');

      const remaining = voucherInfo.max - updatedUses;
      if (showToast) {
        if (remaining === 0) {
          showToast(`Voucher ${code} has reached its maximum uses (${updatedUses}/${voucherInfo.max}).`, 'warning');
        } else {
          showToast(`Voucher ${code} used successfully - ${remaining} use(s) remaining.`);
        }
      }
    } catch {
      if (showToast) showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const onBack = () => {
    navigate('/wifi-registration/Device Info/Voucher');
  };

  return (
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
          ? <>This voucher has been used <strong>{voucherInfo.uses} time(s)</strong>. This registration will be <strong>submitted for admin review</strong>.</>
          : <>This is the <strong>first use</strong> of this voucher. Your device will be <strong>auto-approved</strong>.</>}
      </InfoBox>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleConfirm} disabled={isConnecting} fullWidth padding="13px"
          style={{ backgroundColor: isConnecting ? COLORS.gold.border : voucherInfo?.uses >= 1 ? '#E65100' : COLORS.gold.primary }}>
          {isConnecting ? 'Connecting...' : voucherInfo?.uses >= 1 ? 'Submit for Review' : 'Confirm & Connect'}
        </Button>
      </div>
    </div>
  );
}