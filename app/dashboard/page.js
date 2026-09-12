'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, username: user.email.split('@')[0] })
          .select()
          .single()
        console.log('INSERT RESULT:', newProfile, insertError)
        data = newProfile
      }

      setProfile(data)
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
    </div>
  )
}