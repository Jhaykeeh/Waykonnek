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
    fontWeight: 'bold',
    fontSize,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.7 : 1,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
      backgroundColor: 'transparent',
      color: COLORS.text.mutedGold,
      border: `1px solid ${COLORS.gold.border}`,
      padding: padding || '10px 24px',
    },
    danger: {
      backgroundColor: hovered && !disabled ? '#c62828' : 'transparent',
      color: hovered && !disabled ? '#fff' : '#e53935',
      border: `1px solid #e53935`,
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
