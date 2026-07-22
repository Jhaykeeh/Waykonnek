/**
 * Card Component
 * 
 * Reusable rounded content card wrapper with maroon background
 * and gold border. Used throughout the application for consistent styling.
 */

import { COLORS, FONTS } from '../constants/theme';

export default function Card({ children, style }) {
  return (
    <div
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.borderCard}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 30px rgba(61, 8, 8, 0.08)',
        fontFamily: FONTS.primary,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
