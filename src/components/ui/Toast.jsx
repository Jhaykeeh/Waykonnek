import { useEffect } from 'react';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * Toast — slide-in notification that auto-dismisses.
 * Usage: <Toast message="Saved!" type="success" onDismiss={...} />
 */
export default function Toast({ message, type = 'success', onDismiss, duration = 4500 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  const bgMap = {
    success: '#2E7D32',
    warning: '#E65100',
    error: '#C62828',
    info: '#1565C0',
  };
  const iconMap = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: bgMap[type] || bgMap.success,
        color: '#fff',
        padding: '14px 20px',
        borderRadius: '12px',
        fontFamily: FONTS.primary,
        fontSize: '14px',
        lineHeight: '1.5',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        maxWidth: '420px',
        animation: 'toastSlideIn 0.35s ease',
      }}
    >
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{iconMap[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '0 0 0 8px',
          lineHeight: '1',
          flexShrink: 0,
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
