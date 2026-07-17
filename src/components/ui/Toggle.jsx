import { COLORS } from '../../constants/theme';

/**
 * Toggle — iOS-style on/off switch.
 * Usage: <Toggle enabled={val} onToggle={() => setVal(p => !p)} />
 */
export default function Toggle({ enabled, onToggle, activeColor }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        cursor: 'pointer',
        backgroundColor: enabled
          ? activeColor || COLORS.gold.primary
          : 'rgba(61,8,8,0.6)',
        border: `1px solid ${enabled ? activeColor || COLORS.gold.primary : COLORS.gold.border}`,
        position: 'relative',
        transition: 'background-color 0.3s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          position: 'absolute',
          top: '2px',
          left: enabled ? '27px' : '2px',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}
