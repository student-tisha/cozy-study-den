'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    // create a matching profile row
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, username: email.split('@')[0] })
    }
    router.push('/dashboard')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '8px 16px' }}>Sign Up</button>
      </form>
    </div>
  )
}