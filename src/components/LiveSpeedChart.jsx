import {
  Chart as ChartJS,
  LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { COLORS, FONTS } from '../constants/theme';
import { SectionHeading } from './ui';
import Card from './Card';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

export function LiveBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.4)',
      borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#4CAF50', fontFamily: FONTS.mono,
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50',
        animation: 'bm-pulse 1.4s ease infinite', display: 'inline-block',
      }} />
      LIVE
    </div>
  );
}

function SpeedBox({ value, label, color }) {
  return (
    <div style={{
      flex: 1, background: 'rgba(61,8,8,0.4)', border: `1px solid ${COLORS.gold.border}`,
      borderRadius: '10px', padding: '14px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: FONTS.mono, color }}>{value}</div>
      <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Mbps</div>
      <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>{label}</div>
    </div>
  );
}

const chartOptions = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} Mbps` } } },
  scales: {
    x: { ticks: { color: COLORS.textMuted, font: { size: 10 }, maxTicksLimit: 6 }, grid: { color: 'rgba(212,168,67,0.08)' } },
    y: { min: 0, max: 50, ticks: { color: COLORS.textMuted, font: { size: 10 }, callback: (v) => `${v}M` }, grid: { color: 'rgba(212,168,67,0.08)' } },
  },
};

export default function LiveSpeedChart({ dlHistory, ulHistory, labels }) {
  const currentDl = dlHistory[dlHistory.length - 1];
  const currentUl = ulHistory[ulHistory.length - 1];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Download', data: dlHistory,
        borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.08)',
        borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4,
      },
      {
        label: 'Upload', data: ulHistory,
        borderColor: COLORS.gold.primary, backgroundColor: 'rgba(212,168,67,0.08)',
        borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4, borderDash: [4, 3],
      },
    ],
  };

  return (
    <>
      <style>{`@keyframes bm-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }`}</style>
      <Card>
        <SectionHeading>Real-time Speed</SectionHeading>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <SpeedBox value={currentDl.toFixed(1)} label="↓ Download" color="#4CAF50" />
          <SpeedBox value={currentUl.toFixed(1)} label="↑ Upload" color={COLORS.text.gold} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '12px', color: COLORS.textMuted }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '2px', background: '#4CAF50', display: 'inline-block' }} />Download
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '2px', background: COLORS.gold.primary, display: 'inline-block', borderTop: '2px dashed' }} />Upload
          </span>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '160px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>
    </>
  );
}
