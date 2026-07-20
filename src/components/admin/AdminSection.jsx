import { SectionHeading } from '../ui';

export default function AdminSection({ title, subtitle, action, children, style }) {
  return (
    <section style={{ marginBottom: '32px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: subtitle ? 'flex-start' : 'center', gap: '16px', marginBottom: '16px' }}>
        <div>
          <SectionHeading style={{ margin: 0 }}>{title}</SectionHeading>
          {subtitle && <div style={{ fontSize: '12px', color: '#B2A86C', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
