/**
 * Sidebar — Reusable left sidebar navigation.
 *
 * Props:
 *   userLabel      — Small text above userName (e.g. "Logged in as", "Admin Panel")
 *   userName       — Display name shown at the top
 *   items          — Array of { key, icon, label, badge? }
 *   activeKey      — Currently active item key
 *   onNavigate     — Callback(key) when an item is clicked
 *   onLogout       — Callback when logout is clicked
 *   logoutLabel    — Optional override for logout button text (default "Logout")
 *   width          — Sidebar width (default "260px")
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';

export default function Sidebar({
  userLabel = 'Logged in as',
  userName,
  items = [],
  activeKey,
  onNavigate,
  onLogout,
  logoutLabel = 'Logout',
  width = '260px',
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <aside
      style={{
        width,
        backgroundColor: COLORS.maroon.dark,
        borderRight: `2px solid ${COLORS.gold.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* ── User Info ── */}
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLORS.gold.border}`, textAlign: 'center' }}>
        {userLabel ? (
          <p style={{ color: COLORS.text.mutedGold, fontFamily: FONTS.primary, fontSize: '12px', margin: '0 0 4px' }}>
            {userLabel}
          </p>
        ) : null}
        <p style={{ color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
          {userName}
        </p>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          const isHovered = hoveredItem === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: '100%',
                background: isActive ? COLORS.gold.border : 'transparent',
                border: 'none',
                borderLeft: isActive
                  ? `4px solid ${COLORS.gold.primary}`
                  : '4px solid transparent',
                color: isActive ? COLORS.text.gold : COLORS.text.white,
                fontFamily: FONTS.primary,
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                padding: '14px 20px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: '#F44336',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  lineHeight: '16px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.gold.border}` }}>
        <button
          onClick={onLogout}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.maroon.light; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.maroon.medium; }}
          style={{
            width: '100%',
            backgroundColor: COLORS.maroon.medium,
            border: `1px solid ${COLORS.gold.primary}`,
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          🚪 {logoutLabel}
        </button>
      </div>
    </aside>
  );
}
