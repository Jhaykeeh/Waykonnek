/**
 * BandwidthMonitorPage — Real-time bandwidth usage tracking.
 * Uses extracted sub-components and centralized mock data.
 */

import { useState, useEffect } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import { StatCard } from '../components/ui';
import DashboardSidebar from '../components/DashboardSidebar';
import DataQuotaWidget from '../components/DataQuotaWidget';
import LiveSpeedChart, { LiveBadge } from '../components/LiveSpeedChart';
import ConnectedDevicesWidget from '../components/ConnectedDevicesWidget';
import UsageHistoryWidget from '../components/UsageHistoryWidget';

const MAX_POINTS = 30;

function randomDl() { return parseFloat((15 + Math.random() * 25).toFixed(1)); }
function randomUl() { return parseFloat((4 + Math.random() * 12).toFixed(1)); }
function makeInitialSeries(fn) { return Array.from({ length: MAX_POINTS }, fn); }
function makeLabels() {
  return Array.from({ length: MAX_POINTS }, (_, i) => i === MAX_POINTS - 1 ? 'now' : `-${MAX_POINTS - 1 - i}s`);
}

export default function BandwidthMonitorPage({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('bandwidth-monitor');

  const [dlHistory, setDlHistory] = useState(() => makeInitialSeries(randomDl));
  const [ulHistory, setUlHistory] = useState(() => makeInitialSeries(randomUl));
  const [labels] = useState(makeLabels);

  useEffect(() => {
    const id = setInterval(() => {
      setDlHistory((prev) => [...prev.slice(1), randomDl()]);
      setUlHistory((prev) => [...prev.slice(1), randomUl()]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const handleMenuNavigate = (key) => {
    if (key === 'my-account') { onNavigate('my-account'); return; }
    setActiveMenu(key);
    onNavigate(key);
  };

  const currentDl = dlHistory[dlHistory.length - 1];
  const currentUl = ulHistory[ulHistory.length - 1];

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
        <DashboardSidebar activeKey={activeMenu} onNavigate={handleMenuNavigate} onLogout={onLogout} userName={userName} />

        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
          <header style={{
            backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
            padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>📡</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>Bandwidth Monitor</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Welcome back,</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{userName}</span>
            </div>
          </header>

          <main style={{ padding: '40px' }}>
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

            {/* Monthly Cap Banner */}
            <DataQuotaWidget />

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
              <StatCard 
                value={currentDl.toFixed(1)} 
                unit="Mbps ↓" 
                label="Download Speed" 
                color="#4CAF50" 
              />
              <StatCard 
                value={currentUl.toFixed(1)} 
                unit="Mbps ↑" 
                label="Upload Speed" 
                color={COLORS.text.gold} 
              />
              <StatCard 
                value="12" 
                unit="ms" 
                label="Ping / Latency" 
                color="#4CAF50" 
              />
              <StatCard 
                value="3" 
                unit="devices" 
                label="Active Devices" 
                color={COLORS.text.gold} 
              />
            </div>

            {/* Chart + Devices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <LiveSpeedChart dlHistory={dlHistory} ulHistory={ulHistory} labels={labels} />
              <ConnectedDevicesWidget />
            </div>

            {/* Weekly Usage History */}
            <UsageHistoryWidget />
          </main>
        </div>
      </div>
    </>
  );
}
