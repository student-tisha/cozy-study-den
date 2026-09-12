import { forwardRef } from 'react'

const AuthField = forwardRef(function AuthField(
  { id, label, type, autoComplete, value, onChange },
  ref
) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--cozy-ink-soft)' }}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cozy-focusable"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          borderRadius: 'var(--cozy-radius-sm)',
          border: '1px solid var(--cozy-border)',
          fontSize: 15,
        }}
      />
    </div>
  )
})

export default AuthField
