import { COLORS, FONTS } from '../../constants/theme';
import { Button } from '../ui';
import InfoBox from './InfoBox';
import SummaryRow from './SummaryRow';

export default function VerifyStep({ brand, model, voucherInfo, isConnecting, APP_CONFIG, onConfirm, onBack }) {
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
        <Button onClick={onConfirm} disabled={isConnecting} fullWidth padding="13px"
          style={{ backgroundColor: isConnecting ? COLORS.gold.border : voucherInfo?.uses >= 1 ? '#E65100' : COLORS.gold.primary }}>
          {isConnecting ? 'Connecting...' : voucherInfo?.uses >= 1 ? 'Submit for Review' : 'Confirm & Connect'}
        </Button>
      </div>
    </div>
  );
}