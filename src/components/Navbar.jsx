/**
 * Navbar Component
 * 
 * Top navigation bar for public pages. Displays Waykonnek-CITU logo
 * on the left and navigation links on the right. Active link
 * highlighted in gold. Includes hover effects on all links.
 */

import { useState } from 'react';
import { COLORS, FONTS, NAV_LINKS } from '../constants/theme';
import logo from '../assets/waykonnek.png';

export default function Navbar({ currentPage, onNavigate }) {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <nav
      style={{
        backgroundColor: COLORS.maroon.dark,
        borderBottom: `1px solid ${COLORS.gold.border}`,
        padding: '14px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
        onClick={() => onNavigate('landing')}
      >
        <img src={logo} alt="Waykonnek-CITU" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
          }}
        >
          Waykonnek-CITU
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = currentPage === link.key;
          const isHovered = hoveredLink === link.key;

          return (
            <button
              key={link.key}
              onClick={() => onNavigate(link.key)}
              onMouseEnter={() => setHoveredLink(link.key)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                background: isActive ? 'rgba(212, 168, 67, 0.14)' : 'transparent',
                border: 'none',
                color: isActive ? COLORS.text.gold : COLORS.text.white,
                fontFamily: FONTS.primary,
                fontSize: '15px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: '999px',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                opacity: isHovered ? 0.95 : 1,
              }}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
