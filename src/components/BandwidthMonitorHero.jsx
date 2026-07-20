import { COLORS, FONTS } from '../constants/theme';
import { LiveBadge } from './LiveSpeedChart';

export default function BandwidthMonitorHero() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '6px' }}>
          Real-time Bandwidth
        </h2>
        <p style={{ fontSize: '15px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
          Monitor your WiFi speed, data usage, and connected devices
        </p>
      </div>
      <LiveBadge />
    </div>
  );
}
