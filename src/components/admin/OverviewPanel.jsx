/**
 * OverviewPanel — Network overview stats and top users.
 */
import { COLORS, FONTS } from '../../constants/theme';
import { StatCard } from '../ui/ProgressBar';
import Card from '../Card';

export default function OverviewPanel({ users, pending, approved }) {
  const topUsers = [...users].sort((a, b) => b.usageRaw - a.usageRaw);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <StatCard value={users.length} unit="accounts" label="Total Users" color={COLORS.text.gold} />
        <StatCard value={7} unit="devices" label="Active Devices" color="#4CAF50" />
        <StatCard value={pending} unit="waiting" label="Pending 2nd Devices" color="#FFC107" />
        <StatCard value={approved} unit="devices" label="Approved Today" color="#4CAF50" />
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
        Network Bandwidth Stats
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'This Hour', value: '120 GB', sub: 'Current throughput' },
          { label: 'Today', value: '2.4 TB', sub: 'Daily total usage' },
          { label: 'This Month', value: '58 TB', sub: 'Monthly total usage' },
        ].map((item, i) => (
          <Card key={i} style={{ background: `linear-gradient(135deg, ${COLORS.maroon.medium}, ${COLORS.maroon.light})` }}>
            <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>{item.value}</div>
            <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '4px' }}>{item.sub}</div>
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
        Top Users by Usage
      </h3>
      <Card style={{ padding: 0 }}>
        {topUsers.map((user, idx) => (
          <div key={user.schoolId} style={{
            padding: '14px 24px',
            borderBottom: idx < topUsers.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{ fontSize: '20px', width: '28px', textAlign: 'center', color: idx === 0 ? '#FFD700' : COLORS.textMuted }}>
              {idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `${idx + 1}.`}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.mono }}>{user.usage}</div>
            <span style={{
              padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', fontFamily: FONTS.mono,
              backgroundColor: user.status === 'Active' ? 'rgba(76,175,80,0.15)' : user.status === 'Capped' ? 'rgba(244,67,54,0.15)' : 'rgba(255,193,7,0.15)',
              color: user.status === 'Active' ? '#4CAF50' : user.status === 'Capped' ? '#F44336' : '#FFC107',
            }}>{user.status}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
