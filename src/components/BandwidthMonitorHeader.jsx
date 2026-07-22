import { COLORS, FONTS } from '../constants/theme';

export default function BandwidthMonitorHeader({ userName }) {
  return (
    <header style={{
      backgroundColor: COLORS.maroon.dark,
      borderBottom: `2px solid ${COLORS.gold.border}`,
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212,168,67,0.15)', border: `1px solid ${COLORS.gold.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>BW</span>
        </div>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
          Bandwidth Monitor
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Welcome back,</span>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{userName}</span>
      </div>
    </header>
  );
}
