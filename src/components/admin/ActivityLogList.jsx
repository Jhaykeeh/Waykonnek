import Card from '../Card';

export default function ActivityLogList({ logs }) {
  return (
    <Card style={{ padding: 0 }}>
      {logs.map((log, idx) => (
        <div key={`${log.time}-${idx}`} style={{
          padding: '14px 24px',
          borderBottom: idx < logs.length - 1 ? '1px solid rgba(212,168,67,0.3)' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A843', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#F0E9B5', fontFamily: 'Inter, sans-serif' }}>
              <strong>{log.admin}</strong> — {log.action}: <span style={{ color: '#B2A86C' }}>{log.target}</span>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#B2A86C', fontFamily: 'Monospace, monospace' }}>{log.time}</span>
        </div>
      ))}
    </Card>
  );
}
