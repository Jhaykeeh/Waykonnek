/**
 * DashboardSidebar — Student sidebar wrapper around the reusable Sidebar.
 */
import { MENU_FEATURES } from '../constants/theme';
import Sidebar from './Sidebar';
import homeIcon from '../assets/home.png';
import wifiIcon from '../assets/wifi.png';
import analyticsIcon from '../assets/analytics.png';
import userIcon from '../assets/user.png';
import waykonnekLogo from '../assets/waykonnek.png';

const MENU_ICONS = {
  'dashboard': <img src={homeIcon} alt="Dashboard" style={{ width: '22px', height: '22px' }} />,
  'wifi-registration': <img src={wifiIcon} alt="WiFi Registration" style={{ width: '22px', height: '22px' }} />,
  'bandwidth-monitor': <img src={analyticsIcon} alt="Bandwidth Monitor" style={{ width: '22px', height: '22px' }} />,
  'my-account': <img src={userIcon} alt="My Account" style={{ width: '22px', height: '22px' }} />,
};

export default function DashboardSidebar({ activeKey, onNavigate, onLogout, userName }) {
  const items = MENU_FEATURES.map((m) => ({
    key: m.key,
    icon: MENU_ICONS[m.key] || m.icon,
    label: m.title,
  }));

  return (
    <Sidebar
      userLabel=""
      userName={(
        <>
          <img
            src={waykonnekLogo}
            alt="Waykonnek logo"
            style={{ width: '120px', height: '120px', display: 'block', margin: '0 auto', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: '#F8E3B8', letterSpacing: '0.08em' }}>
            Waykonnek Student
          </span>
        </>
      )}
      items={items}
      activeKey={activeKey}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  );
}
