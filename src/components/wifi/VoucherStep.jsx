import { COLORS, FONTS } from '../../constants/theme';
import { Button } from '../ui';
import InfoBox from './InfoBox';

export default function VoucherStep({
  brand, model,
  voucher, setVoucher,
  voucherError, setVoucherError,
  isChecking, APP_CONFIG,
  focusedField, setFocusedField,
  inputStyle,
  onSubmit, onBack,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Enter Your Voucher</h2>
        <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
          Use the voucher code issued by the CITU IT Office. Each voucher can be used a <strong>maximum of {APP_CONFIG.VOUCHER_MAX_USES} times</strong>.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(212,168,67,0.07)', border: `1px solid ${COLORS.gold.border}` }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: brand === 'Apple' ? 'rgba(212,168,67,0.15)' : 'rgba(100,100,100,0.1)', border: `1px solid ${brand === 'Apple' ? COLORS.gold.border : 'rgba(100,100,100,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: brand === 'Apple' ? COLORS.text.gold : COLORS.textMuted, fontFamily: FONTS.primary }}>{brand === 'Apple' ? 'iOS' : 'DEV'}</span>
        </div>
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
        Voucher usage limit: <strong>{APP_CONFIG.VOUCHER_MAX_USES} devices per voucher</strong>.<br />
        Once the limit is reached, the voucher becomes invalid.
      </InfoBox>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button type="submit" disabled={isChecking} fullWidth padding="13px">
          {isChecking ? 'Validating...' : 'Validate Voucher →'}
        </Button>
      </div>
    </form>
  );
}