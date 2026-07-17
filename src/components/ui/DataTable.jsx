import { COLORS, FONTS } from '../../constants/theme';

/**
 * DataTable — generic tabular layout with header and rows.
 * Usage:
 *   <DataTable columns={[{label:'Name', key:'name'}, ...]} data={[...]} />
 */
export default function DataTable({ columns, data, onRowAction, emptyMessage = 'No data found.' }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: COLORS.textMuted,
          fontFamily: FONTS.primary,
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.borderCard}`,
          borderRadius: '12px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.borderCard}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
          padding: '12px 24px',
          borderBottom: `1px solid ${COLORS.gold.border}`,
        }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: COLORS.textMuted,
              fontFamily: FONTS.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {col.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      {data.map((row, idx) => (
        <div
          key={row.id || idx}
          style={{
            display: 'grid',
            gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
            padding: '14px 24px',
            borderBottom: idx < data.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
            alignItems: 'center',
          }}
        >
          {columns.map((col) => (
            <div key={col.key}>
              {col.render
                ? col.render(row[col.key], row)
                : <span style={{
                    fontSize: '14px',
                    color: col.color || COLORS.textBody,
                    fontFamily: col.mono ? FONTS.mono : FONTS.primary,
                    fontWeight: col.bold ? 'bold' : 'normal',
                  }}>
                    {row[col.key] ?? '—'}
                  </span>
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
