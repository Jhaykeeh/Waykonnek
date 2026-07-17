/**
 * Theme Constants & Style Factories for Waykonnek-CITU
 *
 * Centralized color palette, typography, reusable style factories,
 * and app-wide configuration constants.
 *
 * Usage:
 *   import { COLORS, FONTS, styles, APP_CONFIG } from '../constants/theme';
 */

// ── Color Palette ──────────────────────────────────────────────────
export const COLORS = {
  maroon: {
    dark: '#3d0808',
    medium: '#5a0c0c',
    light: '#7a1010',
    card: '#2a0808',
  },
  gold: {
    primary: '#d4a843',
    light: '#e8c878',
    border: 'rgba(212,168,67,0.2)',
    muted: 'rgba(212,168,67,0.7)',
  },
  text: {
    white: '#ffffff',
    gold: '#d4a843',
    mutedGold: 'rgba(212,168,67,0.7)',
  },
  backgrounds: {
    gradient: 'linear-gradient(135deg, #3d0808 0%, #7a1010 100%)',
    card: '#2a0808',
  },
  bgPage: '#ffffff',
  bgSection: '#fdf8f2',
  bgCard: '#ffffff',
  bgInput: '#ffffff',
  textBody: '#3a3a3a',
  textHeading: '#7a1010',
  textMuted: '#777777',
  textPlaceholder: '#aaaaaa',
  borderCard: 'rgba(212,168,67,0.3)',

  status: {
    approved: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: 'rgba(76,175,80,0.4)' },
    pending: { bg: 'rgba(255,193,7,0.15)', color: '#FFC107', border: 'rgba(255,193,7,0.4)' },
    rejected: { bg: 'rgba(244,67,54,0.15)', color: '#F44336', border: 'rgba(244,67,54,0.4)' },
    active: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: 'rgba(76,175,80,0.4)' },
    capped: { bg: 'rgba(244,67,54,0.15)', color: '#F44336', border: 'rgba(244,67,54,0.4)' },
    suspended: { bg: 'rgba(244,67,54,0.15)', color: '#F44336', border: 'rgba(244,67,54,0.4)' },
    inactive: { bg: 'rgba(158,158,158,0.15)', color: '#9E9E9E', border: 'rgba(158,158,158,0.4)' },
  },
};

// ── Typography ─────────────────────────────────────────────────────
export const FONTS = {
  primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

// ── Reusable Style Factories ───────────────────────────────────────
export const styles = {
  /** Base input field style */
  input: (opts = {}) => ({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: COLORS.bgInput,
    border: `2px solid ${opts.hasError ? '#ff4444' : opts.focused ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px',
    color: COLORS.maroon.card,
    fontFamily: opts.mono ? FONTS.mono : FONTS.primary,
    fontSize: opts.fontSize || '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: opts.focused ? `0 0 8px ${COLORS.gold.primary}` : 'none',
    boxSizing: 'border-box',
    ...opts.extra,
  }),

  /** Base label style */
  label: {
    display: 'block',
    color: COLORS.textHeading,
    fontFamily: FONTS.primary,
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },

  /** Error message style */
  error: {
    color: '#ff4444',
    fontFamily: FONTS.primary,
    fontSize: '12px',
    marginTop: '6px',
    marginBottom: 0,
  },

  /** Primary button (gold) */
  btnPrimary: (opts = {}) => ({
    backgroundColor: opts.disabled
      ? COLORS.gold.muted
      : opts.hovered
        ? COLORS.gold.light
        : COLORS.gold.primary,
    color: COLORS.maroon.dark,
    border: 'none',
    padding: opts.padding || '14px',
    fontSize: opts.fontSize || '16px',
    fontWeight: 'bold',
    fontFamily: FONTS.primary,
    borderRadius: '8px',
    cursor: opts.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: opts.disabled ? 0.7 : 1,
    width: opts.fullWidth ? '100%' : undefined,
    ...opts.extra,
  }),

  /** Secondary button (outlined) */
  btnSecondary: (opts = {}) => ({
    padding: opts.padding || '10px 24px',
    backgroundColor: 'transparent',
    color: opts.color || COLORS.text.mutedGold,
    border: `1px solid ${opts.borderColor || COLORS.gold.border}`,
    borderRadius: '8px',
    fontFamily: FONTS.primary,
    fontSize: opts.fontSize || '14px',
    fontWeight: opts.bold ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...opts.extra,
  }),

  /** Status badge style */
  badge: (status) => {
    const key = status?.toLowerCase();
    const palette = COLORS.status[key] || COLORS.status.inactive;
    return {
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      fontFamily: FONTS.mono,
      backgroundColor: palette.bg,
      color: palette.color,
      border: `1px solid ${palette.border}`,
    };
  },

  /** Section heading style */
  sectionHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.textHeading,
    fontFamily: FONTS.primary,
    marginBottom: '16px',
  },

  /** Card list item row */
  listRow: (isLast) => ({
    padding: '14px 24px',
    borderBottom: isLast ? 'none' : `1px solid ${COLORS.gold.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  }),

  /** Data table header cell */
  th: (width) => ({
    fontSize: '11px',
    fontWeight: 'bold',
    color: COLORS.textMuted,
    fontFamily: FONTS.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...(width && { width }),
  }),

  /** Grid table row cell */
  td: (opts = {}) => ({
    fontSize: opts.fontSize || '14px',
    fontWeight: opts.bold ? 'bold' : 'normal',
    color: opts.color || COLORS.textBody,
    fontFamily: opts.mono ? FONTS.mono : FONTS.primary,
    textAlign: opts.align || 'left',
  }),

  /** Info box (subtle background) */
  infoBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgba(212,168,67,0.07)',
    border: `1px solid ${COLORS.gold.border}`,
    fontSize: '13px',
    color: COLORS.textMuted,
    fontFamily: FONTS.primary,
    lineHeight: '1.6',
  },
};

// ── App-wide Configuration ─────────────────────────────────────────
export const APP_CONFIG = {
  APP_NAME: 'Waykonnek-CITU Bandwidth Monitoring System',
  APP_TAGLINE: 'Intelligent Bandwidth Management for CITU',
  NETWORK_NAME: 'CITU-WIFI',
  TOTAL_USERS: 12000,
  TOTAL_BANDWIDTH_GBPBS: 40,
  TOTAL_REGISTERED_DEVICES: 3200,
  MAX_DEVICES_PER_STUDENT: 2,
  MONTHLY_BANDWIDTH_CAP_GB: 5,
  VOUCHER_MAX_USES: 2,
  DEVICE_BRANDS: [
    'Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo',
    'Huawei', 'Realme', 'Lenovo', 'Asus', 'HP',
    'Dell', 'Acer', 'Microsoft', 'Other',
  ],
  AUTO_REJECT_DAYS: 7,
};

// ── Navigation ─────────────────────────────────────────────────────
export const NAV_LINKS = [
  { key: 'landing', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'login', label: 'Login' },
];

export const MENU_FEATURES = [
  { icon: '🏠', title: 'Dashboard', desc: 'Overview of your network and devices', key: 'dashboard' },
  { icon: '📶', title: 'WiFi Registration', desc: 'Register new devices to the campus network', key: 'wifi-registration' },
  { icon: '📊', title: 'Bandwidth Monitor', desc: 'Real-time bandwidth usage tracking', key: 'bandwidth-monitor' },
  { icon: '👤', title: 'My Account', desc: 'Manage your profile and settings', key: 'my-account' },
];

export const ADMIN_SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Network Overview', key: 'overview' },
  { icon: '👥', label: 'All Users', key: 'users' },
  { icon: '📱', label: 'Device Requests', key: 'devices' },
  { icon: '📈', label: 'Usage Reports', key: 'reports' },
  { icon: '🔐', label: 'Access Control', key: 'access' },
  { icon: '⚙️', label: 'Admin Panel', key: 'admin' },
];

// ── Device helpers ─────────────────────────────────────────────────
export function getNextDeviceNumber(registeredCount) {
  return Math.min(registeredCount + 1, APP_CONFIG.MAX_DEVICES_PER_STUDENT);
}

export function requiresAdminApproval(deviceNo) {
  return deviceNo === APP_CONFIG.MAX_DEVICES_PER_STUDENT;
}

export function getRegistrationStatus(deviceNo) {
  return deviceNo === 1 ? 'APPROVED' : 'PENDING';
}

// ── Deprecated exports (kept for backward compatibility) ────────────
export const MAX_DEVICES_PER_STUDENT = APP_CONFIG.MAX_DEVICES_PER_STUDENT;
