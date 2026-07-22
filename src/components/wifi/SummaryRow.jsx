import { COLORS, FONTS } from '../../constants/theme';

export default function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: `1px solid ${COLORS.gold.border}` }}>
      <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{label}</span>
      <span style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.mono, fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}