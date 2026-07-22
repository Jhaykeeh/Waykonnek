/**
 * UsageReportsPanel — Bandwidth usage reports with weekly/monthly charts.
 */
import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { SectionHeading } from '../ui';
import { MOCK_WEEKLY_REPORT, MOCK_MONTHLY_REPORT } from '../../data/mockData';
import Card from '../Card';
import AdminSection from './AdminSection';

export default function UsageReportsPanel({ users }) {
  const [reportRange, setReportRange] = useState('week');
  const bars = reportRange === 'week' ? MOCK_WEEKLY_REPORT : MOCK_MONTHLY_REPORT;
  const labels = reportRange === 'week'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxBar = Math.max(...bars);

  return (
    <AdminSection
      title="Bandwidth Usage Reports"
      action={(
        <div style={{ display: 'flex', gap: '8px' }}>
          {['week', 'month'].map((r) => (
            <button key={r} onClick={() => setReportRange(r)}
              style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                fontFamily: FONTS.primary, fontWeight: reportRange === r ? 'bold' : 'normal',
                border: `1px solid ${reportRange === r ? COLORS.gold.primary : COLORS.gold.border}`,
                background: reportRange === r ? 'rgba(212,168,67,0.15)' : 'transparent',
                color: reportRange === r ? COLORS.text.gold : COLORS.textMuted,
                textTransform: 'capitalize',
              }}>
              {r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      )}
    >

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Usage', value: reportRange === 'week' ? '19.6 GB' : '251 GB' },
          { label: 'Peak Day', value: reportRange === 'week' ? 'Thursday' : 'May' },
          { label: 'Avg Per User', value: reportRange === 'week' ? '3.9 GB' : '50 GB' },
        ].map((s, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(212,168,67,0.1)', border: `1px solid ${COLORS.gold.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{s.label.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.mono }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px' }}>
          Bandwidth Usage — {reportRange === 'week' ? 'Daily (GB)' : 'Monthly (GB)'}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '160px' }}>
          {bars.map((val, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{val}</div>
              <div style={{
                width: '100%', height: `${(val / maxBar) * 120}px`,
                background: `linear-gradient(180deg, ${COLORS.gold.light}, ${COLORS.gold.primary})`,
                borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease',
              }} />
              <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Per-user breakdown */}
      <SectionHeading>Per-User Breakdown</SectionHeading>
      <Card style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 120px', padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`, fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Student</span><span>School ID</span><span>Usage</span><span>Status</span>
        </div>
        {[...users].sort((a, b) => b.usageRaw - a.usageRaw).map((user, idx) => (
          <div key={user.schoolId} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 120px', padding: '14px 24px', borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
            <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
            <div>
              <div style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, marginBottom: '4px' }}>{user.usage}</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(212,168,67,0.1)', borderRadius: '3px' }}>
                <div style={{
                  width: `${(user.usageRaw / 5) * 100}%`, height: '100%',
                  background: user.usageRaw >= 5 ? '#F44336' : user.usageRaw >= 4 ? '#FFC107' : COLORS.gold.primary,
                  borderRadius: '3px',
                }} />
              </div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', fontFamily: FONTS.mono,
              backgroundColor: user.status === 'Active' ? 'rgba(76,175,80,0.15)' : user.status === 'Capped' ? 'rgba(244,67,54,0.15)' : 'rgba(255,193,7,0.15)',
              color: user.status === 'Active' ? '#4CAF50' : user.status === 'Capped' ? '#F44336' : '#FFC107',
            }}>{user.status}</span>
          </div>
        ))}
      </Card>
    </AdminSection>
  );
}
