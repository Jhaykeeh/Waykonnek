/**
 * DashboardPage — Student dashboard with bandwidth overview,
 * device list, quick actions, and recent activity.
 */

import { useState, useEffect } from 'react';
import { deviceService } from '../services/deviceService';
import { bandwidthService } from '../services/bandwidthService';
import { userService } from '../services/userService';
import { COLORS, FONTS, APP_CONFIG } from '../constants/theme';
import { Badge, ProgressBar, SectionHeading } from '../components/ui';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import logo from '../assets/waykonnek.png';

export default function DashboardPage({ onNavigate, onLogout, onUpdateUser, userName, userRole, user }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [devices, setDevices] = useState([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, total] = await Promise.all([
          deviceService.getDevices().catch(() => []),
          bandwidthService.getTotalUsage().catch(() => 0),
        ]);
        setDevices(
          Array.isArray(devicesRes)
            ? devicesRes.map((d) => ({
                id: d.id,
                brand: d.brand,
                model: d.model,
                mac: d.macAddress || 'N/A',
                status: d.approvalStatus || (d.active ? 'APPROVED' : 'PENDING'),
              }))
            : []
        );
        setTotalUsage(typeof total === 'number' ? total : 0);

        if (!user?.firstName && onUpdateUser) {
          userService.getProfile().then((response) => {
            const data = response.user || response;
            if (data?.firstName) onUpdateUser(data);
          }).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, onUpdateUser]);

  const handleMenuNavigate = (key) => {
    setActiveMenu(key);
    onNavigate(key);
  };

  const totalGb = APP_CONFIG.MONTHLY_BANDWIDTH_CAP_GB;
  const usedGb = typeof totalUsage === 'number' ? Math.min(totalUsage / 1024, totalGb) : 0;
  const remainingGb = (totalGb - usedGb).toFixed(1);
  const usedPct = Math.round((usedGb / totalGb) * 100);
  const maxDevices = APP_CONFIG.MAX_DEVICES_PER_STUDENT;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      <DashboardSidebar activeKey={activeMenu} onNavigate={handleMenuNavigate} onLogout={onLogout} userName={userName} userRole={userRole} />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        {/* Header */}
        <header style={{
          backgroundColor: COLORS.maroon.dark,
          borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '16px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="Waykonnek-CITU" style={{ height: '28px', width: 'auto', borderRadius: '6px' }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                CITU-Bandwidth Monitoring System
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '1px' }}>
                Network: {APP_CONFIG.NETWORK_NAME}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              backgroundColor: 'rgba(212,168,67,0.08)',
              border: `1px solid ${COLORS.gold.border}`,
              borderRadius: '10px', padding: '8px 18px',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Current Usage</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>{usedGb} GB</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: COLORS.gold.border }} />
              <div>
                <div style={{ fontSize: '10px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Remaining</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#4CAF50', fontFamily: FONTS.mono }}>{remainingGb} GB</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: COLORS.gold.border }} />
              <div style={{ fontSize: '11px', color: '#4CAF50', fontFamily: FONTS.primary }}>● Active</div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              {userName}
            </span>
          </div>
        </header>

        <main style={{ padding: '32px 40px' }}>
          {/* Welcome */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '4px' }}>
              Welcome back, {userName} 👋
            </h2>
            <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
              Devices Registered:&nbsp;
              <strong style={{ color: COLORS.textBody }}>{devices.length} / {maxDevices}</strong>
            </p>
          </div>

          {/* Bandwidth Progress Card */}
          <Card style={{
            marginBottom: '24px',
            background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                  Monthly Bandwidth Usage
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>
                  {usedGb} <span style={{ fontSize: '14px' }}>GB</span>
                  <span style={{ fontSize: '16px', color: COLORS.text.mutedGold }}> of {totalGb} GB</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#4CAF50', fontFamily: FONTS.primary }}>● Connected to {APP_CONFIG.NETWORK_NAME}</div>
                <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '2px' }}>Resets in 14 days</div>
              </div>
            </div>
            <ProgressBar percentage={usedPct} height={10} />
            <p style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '6px', marginBottom: 0 }}>
              {usedPct}% used · {remainingGb} GB remaining
            </p>
          </Card>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            <button
              onClick={() => onNavigate('wifi-registration')}
              style={{
                flex: 1, padding: '16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              ➕ Register New Device
            </button>
            <button
              onClick={() => onNavigate('bandwidth-monitor')}
              style={{
                flex: 1, padding: '16px', borderRadius: '10px', cursor: 'pointer',
                backgroundColor: 'transparent', color: COLORS.text.gold,
                border: `2px solid ${COLORS.gold.primary}`,
                fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              📊 View Bandwidth
            </button>
          </div>

          {/* My Devices */}
          <SectionHeading>My Devices</SectionHeading>
          <Card style={{ padding: 0, marginBottom: '28px' }}>
            {loading && (
              <div style={{ padding: '32px 24px', textAlign: 'center', fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                Loading devices...
              </div>
            )}

            {!loading && devices.length === 0 && (
              <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '48px', opacity: 0.5 }}>📱</span>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>No Devices Registered</div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, maxWidth: '320px', lineHeight: '1.6' }}>
                  You haven't registered any devices yet. Click the button below to register your first device to the {APP_CONFIG.NETWORK_NAME} network.
                </div>
                <button
                  onClick={() => onNavigate('wifi-registration')}
                  style={{
                    marginTop: '12px', padding: '12px 28px',
                    backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                    border: 'none', borderRadius: '8px',
                    fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  ➕ Register Your First Device
                </button>
              </div>
            )}

            {!loading && devices.map((device, idx) => (
              <div key={device.id} style={{
                padding: '16px 24px',
                borderBottom: idx < devices.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  backgroundColor: 'rgba(212,168,67,0.1)',
                  border: `1px solid ${COLORS.gold.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                }}>
                  {device.brand === 'Apple' ? '📱' : '💻'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                    {device.brand} {device.model}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                    MAC: {device.mac}
                  </div>
                </div>
                <Badge status={device.status} />
              </div>
            ))}

            {!loading && devices.length === 1 && (
              <div style={{ padding: '14px 24px', textAlign: 'center', borderTop: `1px solid ${COLORS.gold.border}` }}>
                <button
                  onClick={() => onNavigate('wifi-registration')}
                  style={{
                    background: 'none', border: 'none',
                    color: COLORS.text.gold, fontFamily: FONTS.primary,
                    fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  + Add another device ({maxDevices - devices.length} slot remaining)
                </button>
              </div>
            )}

            {!loading && devices.length >= maxDevices && (
              <div style={{
                padding: '12px 24px', textAlign: 'center', borderTop: `1px solid ${COLORS.gold.border}`,
                fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary,
              }}>
                🔒 Maximum devices reached ({maxDevices}/{maxDevices}). Contact IT support to change a device.
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <SectionHeading>Recent Activity</SectionHeading>
          <Card style={{ padding: 0 }}>
            {[
              { time: 'Just now', event: 'Dashboard loaded', details: 'Showing live data from server' },
              { time: 'Today', event: 'Bandwidth cap', details: `${totalGb} GB monthly limit` },
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '16px 24px',
                borderBottom: idx < 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: COLORS.gold.primary, marginTop: '6px', flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                      {item.event}
                    </span>
                    <span style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
}
