import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * FilterTabs — pill-style filter buttons (ALL / PENDING / APPROVED / REJECTED etc.)
 * Usage: <FilterTabs options={['ALL','PENDING','APPROVED']} active={filter} onChange={setFilter} />
 */
export default function FilterTabs({ options, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: FONTS.primary,
              fontWeight: isActive ? 'bold' : 'normal',
              border: `1px solid ${isActive ? COLORS.gold.primary : COLORS.gold.border}`,
              background: isActive ? 'rgba(212,168,67,0.15)' : 'transparent',
              color: isActive ? COLORS.text.gold : COLORS.textMuted,
              transition: 'all 0.2s ease',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
