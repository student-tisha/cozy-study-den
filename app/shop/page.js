'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

const SHOP_ITEMS = [
  { name: 'Cozy Blanket Badge', type: 'badge', cost: 20, emoji: '🧣' },
  { name: 'Warm Lamp Theme', type: 'theme', cost: 40, emoji: '🪔' },
  { name: 'Sleepy Cat Companion Skin', type: 'companion_skin', cost: 60, emoji: '🐱' },
]

export default function ShopPage() {
  const [userId, setUserId] = useState(null)
  const [currency, setCurrency] = useState(0)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('currency').eq('id', user.id).single()
      setCurrency(profile?.currency || 0)
      const { data: items } = await supabase.from('inventory').select('*').eq('user_id', user.id)
      setInventory(items || [])
      setLoading(false)
    }
    init()
  }, [])

  const buyItem = async (item) => {
    const alreadyOwned = inventory.some(i => i.item_name === item.name)
    if (alreadyOwned) {
      setAnnouncement(`You already own ${item.name}.`)
      return
    }
    if (currency < item.cost) {
      setAnnouncement(`Not enough coins for ${item.name}. You need ${item.cost - currency} more.`)
      return
    }

    const newCurrency = currency - item.cost
    await supabase.from('profiles').update({ currency: newCurrency }).eq('id', userId)
    const { data: newItem } = await supabase
      .from('inventory')
      .insert({ user_id: userId, item_name: item.name, item_type: item.type })
      .select()
      .single()

    setCurrency(newCurrency)
    setInventory([...inventory, newItem])
    setAnnouncement(`${item.name} purchased for ${item.cost} coins.`)
  }

  if (loading) {
    return (
      <p style={{ padding: 40, color: 'var(--cozy-ink)' }} role="status" aria-live="polite">
        Loading shop…
      </p>
    )
  }

  
      return (
    <div style={{ minHeight: '100dvh', background: 'var(--cozy-bg)', color: 'var(--cozy-ink)', padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <a href="/dashboard" style={{ padding: '8px 16px', background: 'var(--cozy-surface)', border: '1px solid var(--cozy-border)', borderRadius: 'var(--cozy-radius-md)', color: 'var(--cozy-ink)', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
          <a href="/tasks" style={{ padding: '8px 16px', background: 'var(--cozy-surface)', border: '1px solid var(--cozy-border)', borderRadius: 'var(--cozy-radius-md)', color: 'var(--cozy-ink)', textDecoration: 'none', fontSize: 14 }}>Quests</a>
        </nav>

        <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, margin: 0 }}>Shop</h1>
          <span
            aria-label={`${currency} coins available`}
            style={{
              fontWeight: 600,
              background: 'var(--cozy-surface)',
              border: '1px solid var(--cozy-border)',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 14,
            }}
          >
            🪙 {currency}
          </span>
        </header>

        <div aria-live="polite" className="sr-only">{announcement}</div>
        {announcement && (
          <p style={{ fontSize: 13, color: 'var(--cozy-ink-soft)', margin: '0 0 16px' }} aria-hidden="true">
            {announcement}
          </p>
        )}

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
          {SHOP_ITEMS.map((item) => {
            const owned = inventory.some((i) => i.item_name === item.name)
            const canAfford = currency >= item.cost

            return (
              <li key={item.name}>
                <div style={{ background: 'var(--cozy-surface)', border: '1px solid var(--cozy-border)', borderRadius: 'var(--cozy-radius-md)', padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }} aria-hidden="true">{item.emoji}</div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--cozy-ink-soft)' }}>{item.cost} coins</p>
                  <button
                    type="button"
                    onClick={() => buyItem(item)}
                    disabled={owned}
                    className="cozy-focusable"
                    aria-label={
                      owned
                        ? `${item.name}, already owned`
                        : !canAfford
                        ? `${item.name}, ${item.cost} coins, not enough coins`
                        : `Buy ${item.name} for ${item.cost} coins`
                    }
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--cozy-radius-sm)',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: owned ? 'default' : 'pointer',
                      background: owned ? 'var(--cozy-border)' : 'var(--cozy-rose)',
                      color: 'var(--cozy-ink)',
                      opacity: owned ? 0.7 : 1,
                    }}
                  >
                    {owned ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32 }}>Your inventory</h2>
        {inventory.length === 0 ? (
          <p style={{ color: 'var(--cozy-ink-soft)', fontSize: 14 }}>Nothing yet — your first purchase will show up here.</p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {inventory.map((i) => (
              <li key={i.id} style={{ fontSize: 14 }}>{i.item_name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}