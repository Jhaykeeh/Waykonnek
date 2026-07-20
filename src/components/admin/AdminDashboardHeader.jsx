import { COLORS, FONTS, ADMIN_SIDEBAR_ITEMS } from '../../constants/theme';

export default function AdminDashboardHeader({ activeKey }) {
  const activeItem = ADMIN_SIDEBAR_ITEMS.find((item) => item.key === activeKey) || {};

  return (
    <header style={{
      backgroundColor: COLORS.maroon.dark,
      borderBottom: `2px solid ${COLORS.gold.border}`,
      padding: '18px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
        {activeItem.icon} {activeItem.label}
      </span>
      <span style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
        CITU-Bandwidth Monitoring System · Admin
      </span>
    </header>
  );
}
