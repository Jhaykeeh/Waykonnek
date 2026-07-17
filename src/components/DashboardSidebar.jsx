/**
 * DashboardSidebar — Student sidebar wrapper around the reusable Sidebar.
 */
import { MENU_FEATURES } from '../constants/theme';
import Sidebar from './Sidebar';

export default function DashboardSidebar({ activeKey, onNavigate, onLogout, userName }) {
  const items = MENU_FEATURES.map((m) => ({ key: m.key, icon: m.icon, label: m.title }));

  return (
    <Sidebar
      userLabel="Logged in as"
      userName={userName}
      items={items}
      activeKey={activeKey}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  );
}
