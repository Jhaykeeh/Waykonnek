/**
 * DeviceRequestsPanel — Approve/reject device registration requests.
 */
import { COLORS, FONTS } from '../../constants/theme';
import { Badge, Button, FilterTabs } from '../ui';
import Card from '../Card';
import { useState } from 'react';

export default function DeviceRequestsPanel({ requests, onApprove, onReject }) {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
            Device Registration Requests
          </h3>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '4px 0 0' }}>
            1st use of a voucher is auto-approved · 2nd use needs your review
          </p>
        </div>
        <FilterTabs options={['ALL', 'PENDING', 'APPROVED', 'REJECTED']} active={filter} onChange={setFilter} />
      </div>

      <Card style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: COLORS.textMuted, fontFamily: FONTS.primary }}>No requests found.</div>
        ) : (
          filtered.map((req, idx) => (
            <div key={req.id} style={{
              padding: '16px 24px',
              borderBottom: idx < filtered.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                backgroundColor: 'rgba(212,168,67,0.1)', border: `1px solid ${COLORS.gold.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>
                {req.brand === 'Apple' ? '📱' : '💻'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                  {req.name} · <span style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.textMuted }}>{req.schoolId}</span>
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                  {req.brand} {req.model} — Device #{req.deviceNo} · {req.submitted}
                </div>
                {req.voucherCode && (
                  <div style={{ fontSize: '12px', color: COLORS.text.gold, fontFamily: FONTS.mono, marginTop: '4px' }}>
                    🎫 Voucher: {req.voucherCode}
                  </div>
                )}
              </div>
              <Badge status={req.status} />
              {req.deviceNo === 1 && req.status === 'APPROVED' && (
                <span style={{ fontSize: '11px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, fontStyle: 'italic' }}>Auto-approved</span>
              )}
              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="primary" padding="7px 16px" fontSize="13px" onClick={() => onApprove(req.id)}>✓ Approve</Button>
                  <Button variant="danger" padding="7px 16px" fontSize="13px" onClick={() => onReject(req.id)}>✗ Reject</Button>
                </div>
              )}
            </div>
          ))
        )}
      </Card>
    </>
  );
}
