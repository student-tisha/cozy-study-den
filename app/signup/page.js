'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import AuthField from '../../components/AuthField'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, username: email.split('@')[0] })
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--cozy-bg)',
        color: 'var(--cozy-ink)',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSignup}
        noValidate
        aria-labelledby="signup-heading"
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--cozy-surface)',
          border: '1px solid var(--cozy-border)',
          borderRadius: 'var(--cozy-radius-lg)',
          padding: '32px 28px',
        }}
      >
        <h1 id="signup-heading" style={{ fontSize: 28, margin: '0 0 6px' }}>
          Start your den
        </h1>
        <p style={{ margin: '0 0 24px', color: 'var(--cozy-ink-soft)', fontSize: 14 }}>
          A few seconds and your companion is ready to grow.
        </p>

        <AuthField
          id="signup-email"
          ref={emailRef}
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <AuthField
          id="signup-confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />

        <div role="alert" aria-live="assertive" style={{ minHeight: 20 }}>
          {error && (
            <p style={{ color: 'var(--cozy-error)', fontSize: 13, margin: '4px 0 0' }}>{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cozy-focusable"
          style={{
            width: '100%',
            marginTop: 20,
            padding: '12px 16px',
            borderRadius: 'var(--cozy-radius-md)',
            border: 'none',
            background: 'var(--cozy-sage)',
            color: 'var(--cozy-ink)',
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        
          <a 
          href="/login"
          className="cozy-focusable"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            padding: '10px 16px',
            borderRadius: 'var(--cozy-radius-md)',
            border: '1px solid var(--cozy-border)',
            color: 'var(--cozy-ink)',
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Already have an account? Log in
        </a>
      </form>
    </div>
  )
}