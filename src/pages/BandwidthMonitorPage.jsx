/**
 * BandwidthMonitorPage — Real-time bandwidth usage tracking.
 * Uses extracted sub-components and centralized mock data.
 */

import { useState, useEffect } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import BandwidthMonitorHeader from '../components/BandwidthMonitorHeader';
import BandwidthMonitorHero from '../components/BandwidthMonitorHero';
import BandwidthMonitorStats from '../components/BandwidthMonitorStats';
import DataQuotaWidget from '../components/DataQuotaWidget';
import UsageHistoryWidget from '../components/UsageHistoryWidget';

const MAX_POINTS = 30;

function randomDl() { return parseFloat((15 + Math.random() * 25).toFixed(1)); }
function randomUl() { return parseFloat((4 + Math.random() * 12).toFixed(1)); }
function makeInitialSeries(fn) { return Array.from({ length: MAX_POINTS }, fn); }

export default function BandwidthMonitorPage({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('bandwidth-monitor');

  const [dlHistory, setDlHistory] = useState(() => makeInitialSeries(randomDl));
  const [ulHistory, setUlHistory] = useState(() => makeInitialSeries(randomUl));

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
          <BandwidthMonitorHeader userName={userName} />

          <main style={{ padding: '40px' }}>
            <BandwidthMonitorHero />

            {/* Monthly Cap Banner */}
            <DataQuotaWidget />

            {/* Stats Row */}
            <BandwidthMonitorStats
              stats={[
                { value: currentDl.toFixed(1), unit: 'Mbps ↓', label: 'Download Speed', color: '#4CAF50' },
                { value: currentUl.toFixed(1), unit: 'Mbps ↑', label: 'Upload Speed', color: COLORS.text.gold },
                { value: '12', unit: 'ms', label: 'Ping / Latency', color: '#4CAF50' },
                { value: '3', unit: 'devices', label: 'Active Devices', color: COLORS.text.gold },
              ]}
            />

            {/* Weekly Usage History */}
            <UsageHistoryWidget />
          </main>
        </div>
      </div>
    </>
  );
}
