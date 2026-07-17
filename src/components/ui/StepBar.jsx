import { COLORS, FONTS } from '../../constants/theme';

/**
 * StepBar — horizontal multi-step progress indicator.
 * Usage: <StepBar steps={['Device Info','Voucher','Verify','Connected']} currentStep={2} />
 */
export default function StepBar({ steps, currentStep }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
      {steps.map((label, i) => {
        const done = currentStep > i + 1;
        const current = currentStep === i + 1;
        return (
          <div key={label} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                height: '4px',
                borderRadius: '2px',
                marginBottom: '6px',
                backgroundColor: done || current ? COLORS.gold.primary : COLORS.gold.border,
                transition: 'background-color 0.4s ease',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontFamily: FONTS.primary,
                color: done || current ? COLORS.gold.primary : COLORS.textMuted,
              }}
            >
              {done ? '✓ ' : ''}
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
