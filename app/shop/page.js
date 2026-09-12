'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

const SHOP_ITEMS = [
  { name: 'Cozy Blanket Badge', type: 'badge', cost: 20 },
  { name: 'Warm Lamp Theme', type: 'theme', cost: 40 },
  { name: 'Sleepy Cat Companion Skin', type: 'companion_skin', cost: 60 },
]

export default function ShopPage() {
  const [userId, setUserId] = useState(null)
  const [currency, setCurrency] = useState(0)
  const [inventory, setInventory] = useState([])
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
    }
    init()
  }, [])

  const buyItem = async (item) => {
    if (currency < item.cost) {
      alert("Not enough currency!")
      return
    }
    const alreadyOwned = inventory.some(i => i.item_name === item.name)
    if (alreadyOwned) {
      alert("You already own this!")
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
    alert(`Purchased: ${item.name}!`)
  }

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h1>Shop</h1>
      <p>Your currency: {currency} coins</p>

      {SHOP_ITEMS.map(item => {
        const owned = inventory.some(i => i.item_name === item.name)
        return (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, borderBottom: '1px solid #ccc' }}>
            <span>{item.name} — {item.cost} coins</span>
            <button onClick={() => buyItem(item)} disabled={owned} aria-label={`Buy ${item.name}`}>
              {owned ? 'Owned' : 'Buy'}
            </button>
          </div>
        )
      })}

      <h2>Your Inventory</h2>
      {inventory.map(i => <p key={i.id}>{i.item_name}</p>)}
    </div>
  )
}