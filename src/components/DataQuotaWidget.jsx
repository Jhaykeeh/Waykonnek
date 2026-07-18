import { useState, useEffect } from 'react';
import { bandwidthService } from '../services/authService';
import { COLORS, FONTS, APP_CONFIG } from '../constants/theme';
import { ProgressBar } from './ui';
import Card from './Card';

export default function DataQuotaWidget() {
  const [totalUsage, setTotalUsage] = useState(3.2);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ d: 14, h: 6, m: 22, s: 41 });

  const totalCap = APP_CONFIG.MONTHLY_BANDWIDTH_CAP_GB;

  useEffect(() => {
    bandwidthService.getTotalUsage()
      .then((val) => { if (typeof val === 'number') setTotalUsage(val / 1024); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d = Math.max(0, d - 1); }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const usagePercentage = Math.round((totalUsage / totalCap) * 100);

  return (
    <Card style={{ marginBottom: '28px', background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '6px' }}>Monthly Data Cap</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>
            {totalUsage.toFixed(1)} <span style={{ fontSize: '18px', color: COLORS.text.mutedGold }}>GB</span>{' '}
            <span style={{ fontSize: '16px', color: COLORS.text.mutedGold }}>of {totalCap} GB</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>Resets in</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.text.white, fontFamily: FONTS.mono }}>
            {countdown.d}d {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
        <span>Used: <strong style={{ color: COLORS.text.gold }}>{usagePercentage}%</strong></span>
        <span>Remaining: <strong style={{ color: '#4CAF50' }}>{(totalCap - totalUsage).toFixed(1)} GB</strong></span>
      </div>
      <ProgressBar percentage={usagePercentage} height={14} />
      <p style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '8px', marginBottom: 0 }}>
        {loading ? 'Loading usage data...' : `Current usage: ${totalUsage.toFixed(1)} GB of ${totalCap} GB cap.`}
      </p>
    </Card>
  );
}
