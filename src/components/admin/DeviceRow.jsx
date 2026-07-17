/**
 * DeviceRow — single device usage row with icon, name, IP, band, usage, and progress bar.
 */
import { COLORS, FONTS } from '../../constants/theme';

export default function DeviceRow({ icon, name, ip, band, usageGb, pct, color, isLast }) {
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 0',
        borderBottom: isLast ? 'none' : `1px solid ${COLORS.gold.border}`,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'rgba(212,168,67,0.12)',
          border: `1px solid ${COLORS.gold.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary }}>{name}</div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{ip} · {band}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontFamily: FONTS.mono, color: COLORS.text.gold, fontWeight: 'bold' }}>
            {usageGb.toFixed(2)} GB
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
            {pct.toFixed(1)}%
          </div>
        </div>
      </div>
      <div style={{ marginBottom: isLast ? 0 : '4px' }}>
        <div style={{
          width: '100%', height: '6px', borderRadius: '3px',
          backgroundColor: 'rgba(61,8,8,0.7)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: '3px',
            background: color || `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </>
  );
}
