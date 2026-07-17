import { COLORS, FONTS } from '../../constants/theme';

/**
 * Badge — renders a colored status pill.
 * Usage: <Badge status="approved">APPROVED</Badge>
 */
export default function Badge({ status, children }) {
  const key = status?.toLowerCase();
  const palette = COLORS.status[key] || COLORS.status.inactive;

  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        fontFamily: FONTS.mono,
        backgroundColor: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children || status}
    </span>
  );
}
