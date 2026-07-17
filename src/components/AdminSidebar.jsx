/**
 * AdminSidebar — Admin sidebar wrapper around the reusable Sidebar.
 */
import { ADMIN_SIDEBAR_ITEMS } from '../constants/theme';
import Sidebar from './Sidebar';

export default function AdminSidebar({ activeKey, onSelect, pendingCount, onLogout }) {
  const items = ADMIN_SIDEBAR_ITEMS.map((m) => ({
    key: m.key,
    icon: m.icon,
    label: m.label,
    badge: m.key === 'devices' ? pendingCount : undefined,
  }));

  return (
    <Sidebar
      userLabel="Admin Panel"
      userName="IT Administrator"
      items={items}
      activeKey={activeKey}
      onNavigate={onSelect}
      onLogout={onLogout}
      logoutLabel="Logout"
      width="240px"
    />
  );
}
