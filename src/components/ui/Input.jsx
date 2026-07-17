import { COLORS, FONTS } from '../../constants/theme';

/**
 * Input — standardised form input with label, error, and focus glow.
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  focused,
  onFocus,
  onBlur,
  mono = false,
  readOnly = false,
  children, // for select options
}) {
  const baseStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: COLORS.bgInput,
    border: `2px solid ${error ? '#ff4444' : focused ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px',
    color: COLORS.maroon.card,
    fontFamily: mono ? FONTS.mono : FONTS.primary,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focused ? `0 0 8px ${COLORS.gold.primary}` : 'none',
    boxSizing: 'border-box',
    cursor: readOnly ? 'default' : undefined,
  };

  const labelStyle = {
    display: 'block',
    color: COLORS.textHeading,
    fontFamily: FONTS.primary,
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const errorStyle = {
    color: '#ff4444',
    fontFamily: FONTS.primary,
    fontSize: '12px',
    marginTop: '6px',
    marginBottom: 0,
  };

  const sharedHandlers = { onFocus, onBlur };

  let field;
  if (type === 'select') {
    field = (
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={baseStyle}
        {...sharedHandlers}
      >
        {children}
      </select>
    );
  } else if (type === 'textarea') {
    field = (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={6}
        style={{ ...baseStyle, resize: 'vertical', minHeight: '120px' }}
        {...sharedHandlers}
      />
    );
  } else {
    field = (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={baseStyle}
        {...sharedHandlers}
      />
    );
  }

  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      {field}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}
