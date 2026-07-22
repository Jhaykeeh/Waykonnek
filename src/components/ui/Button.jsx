import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * Button — primary (gold), secondary (outlined), or danger (red).
 * Handles hover state internally; passes onClick, disabled, and extra styles.
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  fullWidth = false,
  padding,
  fontSize = '14px',
  style: extraStyle = {},
  ...rest
}) {
  const [hovered, setHovered] = useState(false);

  const base = {
    fontFamily: FONTS.primary,
    fontWeight: '700',
    fontSize,
    borderRadius: '999px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.7 : 1,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 6px 16px rgba(61, 8, 8, 0.12)',
    transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
    ...(fullWidth && { width: '100%' }),
    ...(padding && { padding }),
  };

  const variants = {
    primary: {
      backgroundColor: disabled
        ? COLORS.gold.muted
        : hovered
          ? COLORS.gold.light
          : COLORS.gold.primary,
      color: COLORS.maroon.dark,
      padding: padding || '12px 24px',
    },
    secondary: {
      backgroundColor: hovered && !disabled ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
      color: COLORS.text.mutedGold,
      border: `1px solid ${COLORS.gold.border}`,
      boxShadow: 'none',
      padding: padding || '10px 24px',
    },
    danger: {
      backgroundColor: hovered && !disabled ? '#c62828' : 'transparent',
      color: hovered && !disabled ? '#fff' : '#e53935',
      border: `1px solid #e53935`,
      boxShadow: 'none',
      padding: padding || '10px 24px',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant], ...extraStyle }}
      {...rest}
    >
      {children}
    </button>
  );
}
