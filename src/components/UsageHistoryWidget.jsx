import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import { SectionHeading } from './ui';
import Card from './Card';
import { MOCK_DAILY_HISTORY, MOCK_HOURLY_HISTORY } from '../data/mockData';

function UsageBar({ day, gb, maxGb }) {
  const pct = ((gb / maxGb) * 100).toFixed(1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono, width: '32px', flexShrink: 0 }}>{day}</div>
      <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(61,8,8,0.6)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '4px',
          background: `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ fontSize: '11px', fontFamily: FONTS.mono, color: COLORS.textMuted, width: '38px', textAlign: 'right', flexShrink: 0 }}>
        {gb.toFixed(1)}G
      </div>
    </div>
  );
}

export default function UsageHistoryWidget() {
  const [usageView, setUsageView] = useState('daily');

  const historyData = usageView === 'daily' ? MOCK_DAILY_HISTORY : MOCK_HOURLY_HISTORY;
  const maxGb = Math.max(...historyData.map((d) => d.gb));
  const weeklyTotal = MOCK_DAILY_HISTORY.reduce((s, d) => s + d.gb, 0);
  const dailyAvg = weeklyTotal / MOCK_DAILY_HISTORY.length;
  const peakDay = MOCK_DAILY_HISTORY.reduce((a, b) => (a.gb > b.gb ? a : b));

  return (
    <>
      <SectionHeading style={{ marginBottom: '20px' }}>Weekly Usage History</SectionHeading>
      <Card style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '16px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
            {usageView === 'daily' ? 'Last 7 days' : 'Today by hour'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['daily', 'hourly'].map((v) => (
              <button key={v} onClick={() => setUsageView(v)} style={{
                padding: '6px 14px', borderRadius: '20px',
                border: `1px solid ${usageView === v ? COLORS.gold.primary : COLORS.gold.border}`,
                background: usageView === v ? 'rgba(212,168,67,0.18)' : 'transparent',
                color: usageView === v ? COLORS.text.gold : COLORS.textMuted,
                fontSize: '12px', cursor: 'pointer', fontFamily: FONTS.primary, transition: 'all 0.2s',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {historyData.map((item) => (
          <UsageBar key={item.day} day={item.day} gb={item.gb} maxGb={maxGb} />
        ))}

        <div style={{
          borderTop: `1px solid ${COLORS.gold.border}`, paddingTop: '16px', marginTop: '8px',
          display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary,
        }}>
          <span>Weekly total: <span style={{ color: COLORS.text.gold, fontWeight: 'bold', fontFamily: FONTS.mono }}>{weeklyTotal.toFixed(1)} GB</span></span>
          <span>Daily avg: <span style={{ color: COLORS.text.gold, fontFamily: FONTS.mono }}>{dailyAvg.toFixed(2)} GB</span></span>
          <span>Peak: <span style={{ color: COLORS.text.gold, fontFamily: FONTS.mono }}>{peakDay.day} — {peakDay.gb} GB</span></span>
        </div>
      </Card>
    </>
  );
}
