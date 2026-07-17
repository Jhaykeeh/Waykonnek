/**
 * BrandBar Component
 * 
 * Horizontal branding bar with "Waykonnek-CITU WiFi Lag" text.
 * Used on registration step pages. Maroon background with gold text.
 */

import { COLORS, FONTS } from '../constants/theme';
import logo from '../assets/waykonnek.png';

export default function BrandBar() {
  return (
    <div
      style={{
        backgroundColor: COLORS.maroon.medium,
        borderBottom: `2px solid ${COLORS.gold.border}`,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      <img src={logo} alt="Waykonnek-CITU" style={{ height: '32px', width: 'auto', borderRadius: '8px' }} />
      <span
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: COLORS.text.gold,
          fontFamily: FONTS.primary,
        }}
      >
        Waykonnek-CITU WiFi Lag
      </span>
    </div>
  );
}
