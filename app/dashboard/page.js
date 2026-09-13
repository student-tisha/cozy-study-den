'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [attributes, setAttributes] = useState([])
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (!data) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: user.id, username: user.email.split('@')[0] })
          .select()
          .single()
        data = newProfile
      }

      setProfile(data)

      const { data: attrs } = await supabase.from('attributes').select('*').eq('user_id', user.id)
      setAttributes(attrs || [])
    }
    loadProfile()
  }, [])

  if (!profile) {
    return (
      <p style={{ padding: 40, color: 'var(--cozy-ink)' }} role="status" aria-live="polite">
        Loading your den…
      </p>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cozy-bg)', color: 'var(--cozy-ink)', padding: '32px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <a href="/tasks" style={{ padding: '8px 16px', background: 'var(--cozy-surface)', border: '1px solid var(--cozy-border)', borderRadius: 'var(--cozy-radius-md)', color: 'var(--cozy-ink)', textDecoration: 'none', fontSize: 14 }}>Quests</a>
          <a href="/shop" style={{ padding: '8px 16px', background: 'var(--cozy-surface)', border: '1px solid var(--cozy-border)', borderRadius: 'var(--cozy-radius-md)', color: 'var(--cozy-ink)', textDecoration: 'none', fontSize: 14 }}>Shop</a>
          </nav>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Welcome, {profile.username} 🌿</h1>
        <p style={{ color: 'var(--cozy-ink-soft)', marginBottom: 24 }}>Here's how your den is growing.</p>

        <div style={{
          background: 'var(--cozy-surface)',
          border: '1px solid var(--cozy-border)',
          borderRadius: 'var(--cozy-radius-lg)',
          padding: 24,
          marginBottom: 20,
        }}>
          <p style={{ margin: '0 0 8px', fontSize: 15 }}>Level <strong>{profile.level}</strong></p>
          <p style={{ margin: '0 0 8px', fontSize: 15 }}>XP: <strong>{profile.xp}</strong></p>
          <p style={{ margin: '0 0 8px', fontSize: 15 }}>Currency: <strong>🪙 {profile.currency}</strong></p>
          <p style={{ margin: 0, fontSize: 15 }}>Streak: <strong>{profile.streak_count} days 🔥</strong></p>
        </div>

        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Attributes</h2>
        {attributes.length === 0 ? (
          <p style={{ color: 'var(--cozy-ink-soft)', fontSize: 14 }}>Complete quests to grow your attributes.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {attributes.map(attr => (
              <div key={attr.id} style={{
                background: 'var(--cozy-surface)',
                border: '1px solid var(--cozy-border)',
                borderRadius: 'var(--cozy-radius-md)',
                padding: '12px 16px',
                fontSize: 14,
              }}>
                {attr.attribute_name}: Level {attr.attribute_level} ({attr.attribute_xp} XP)
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
