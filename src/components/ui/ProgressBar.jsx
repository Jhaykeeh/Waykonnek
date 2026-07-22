import { COLORS, FONTS } from '../../constants/theme';

/**
 * ProgressBar — horizontal bar with gradient fill.
 * Usage: <ProgressBar percentage={65} height={10} />
 */
export default function ProgressBar({ percentage, height = 10, color, style: extra }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: height / 2,
        backgroundColor: 'rgba(61, 8, 8, 0.1)',
        border: `1px solid rgba(61, 8, 8, 0.12)`,
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
        ...extra,
      }}
    >
      <div
        style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          borderRadius: height / 2,
          background:
            color || `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
}

/**
 * StatCard — metric card with value, unit, label.
 */
export function StatCard({ value, unit, label, color }) {
  return (
    <div
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.borderCard}`,
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          fontFamily: FONTS.mono,
          color,
          marginBottom: '2px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '10px',
          color: COLORS.textMuted,
          fontFamily: FONTS.mono,
          marginBottom: '2px',
        }}
      >
        {unit}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: COLORS.textMuted,
          fontFamily: FONTS.primary,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * SectionHeading — consistent section title.
 */
export function SectionHeading({ icon, children, style: extra }) {
  return (
    <h3
      style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: COLORS.textHeading,
        fontFamily: FONTS.primary,
        marginBottom: '16px',
        ...extra,
      }}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </h3>
  );
}
