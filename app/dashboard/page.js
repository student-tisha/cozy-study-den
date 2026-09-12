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

  if (!profile) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 20 }}>
      <h1>Welcome, {profile.username}</h1>
      <p>Level: {profile.level}</p>
      <p>XP: {profile.xp}</p>
      <p>Currency: {profile.currency}</p>
      <p>Streak: {profile.streak_count} days 🔥</p>

      <h2>Attributes</h2>
      {attributes.map(attr => (
        <p key={attr.id}>{attr.attribute_name}: Level {attr.attribute_level} ({attr.attribute_xp} XP)</p>
      ))}
    </div>
  )
}