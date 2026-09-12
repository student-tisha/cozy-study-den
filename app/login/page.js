'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import AuthField from '../../components/AuthField'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
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
        onSubmit={handleLogin}
        noValidate
        aria-labelledby="login-heading"
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--cozy-surface)',
          border: '1px solid var(--cozy-border)',
          borderRadius: 'var(--cozy-radius-lg)',
          padding: '32px 28px',
        }}
      >
        <h1 id="login-heading" style={{ fontSize: 28, margin: '0 0 6px' }}>
          Welcome back
        </h1>
        <p style={{ margin: '0 0 24px', color: 'var(--cozy-ink-soft)', fontSize: 14 }}>
          Pick up your streak where you left it.
        </p>

        <AuthField
          id="login-email"
          ref={emailRef}
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
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
            background: 'var(--cozy-honey)',
            color: 'var(--cozy-ink)',
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>

        
          <a 
          href="/signup"
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
          New here? Create an account
        </a>
      </form>
    </div>
  )
}