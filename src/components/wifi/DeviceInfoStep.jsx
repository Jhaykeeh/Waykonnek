import { COLORS, FONTS } from '../../constants/theme';
import { Button } from '../ui';
import InfoBox from './InfoBox';

export default function DeviceInfoStep({
  brand, model, setBrand, setModel,
  errors, setErrors,
  focusedField, setFocusedField,
  inputStyle, maxDevices, APP_CONFIG,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>Device Information</h2>
        <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
          Enter the brand and model of the device you want to connect to <strong>{APP_CONFIG.NETWORK_NAME}</strong>.
        </p>
      </div>
      <div>
        <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Brand</label>
        <select value={brand} onChange={(e) => { setBrand(e.target.value); setErrors((p) => ({ ...p, brand: '' })); }}
          onFocus={() => setFocusedField('brand')} onBlur={() => setFocusedField(null)}
          style={inputStyle('brand', !!errors.brand)}>
          <option value="">— Select brand —</option>
          {APP_CONFIG.DEVICE_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.brand && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.brand}</p>}
      </div>
      <div>
        <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Device Model</label>
        <input type="text" value={model} placeholder="e.g. iPhone 14, Galaxy S23, Vivobook 15"
          onChange={(e) => { setModel(e.target.value); setErrors((p) => ({ ...p, model: '' })); }}
          onFocus={() => setFocusedField('model')} onBlur={() => setFocusedField(null)}
          style={inputStyle('model', !!errors.model)} />
        {errors.model && <p style={{ color: '#e53935', fontFamily: FONTS.primary, fontSize: '12px', margin: '5px 0 0' }}>{errors.model}</p>}
      </div>
      <InfoBox>
        You may register up to <strong>{maxDevices} devices</strong> per account.
        Your <strong>1st device</strong> is auto-approved. Your <strong>2nd device</strong> requires admin approval.
      </InfoBox>
      <Button type="submit" fullWidth padding="13px">Next: Enter Voucher →</Button>
    </form>
  );
}