import { COLORS, FONTS } from '../../constants/theme';

export default function InfoBox({ children }) {
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