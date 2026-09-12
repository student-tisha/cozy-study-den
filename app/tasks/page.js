'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { applyXp, calculateStreak } from '../../lib/gameLogic'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [attribute, setAttribute] = useState('Focus')
  const [userId, setUserId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
      fetchTasks(user.id)
    }
    init()
  }, [])

  const fetchTasks = async (uid) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setTasks(data || [])
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: userId, title, attribute, xp_value: 10 })
      .select()
      .single()
    if (!error) {
      setTasks([data, ...tasks])
      setTitle('')
    }
  }

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const completeTask = async (task) => {
    if (task.is_completed) return

    // mark task done
    await supabase
      .from('tasks')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', task.id)
    setTasks(tasks.map(t => t.id === task.id ? { ...t, is_completed: true } : t))

    // fetch current profile
    const { data: profile } = await supabase
      .from('profiles')
      //.select('level, xp, streak_count, last_active_date')
      .select('level, xp, streak_count, last_active_date, currency')
      .eq('id', userId)
      .single()

    const { level, xp, leveledUp } = applyXp(profile.level, profile.xp, task.xp_value)
    const { streak, lastActiveDate } = calculateStreak(profile.last_active_date, profile.streak_count)

    await supabase
  .from('profiles')
  .update({
    level,
    xp,
    streak_count: streak,
    last_active_date: lastActiveDate,
    currency: profile.currency + 5
  })
  .eq('id', userId)

    // find or create the attribute row for this task's attribute
    let { data: attrRow } = await supabase
      .from('attributes')
      .select('*')
      .eq('user_id', userId)
      .eq('attribute_name', task.attribute)
      .single()

    if (!attrRow) {
      const { data: newAttr } = await supabase
        .from('attributes')
        .insert({ user_id: userId, attribute_name: task.attribute })
        .select()
        .single()
      attrRow = newAttr
    }

    const attrResult = applyXp(attrRow.attribute_level, attrRow.attribute_xp, task.xp_value)

    await supabase
      .from('attributes')
      .update({ attribute_level: attrResult.level, attribute_xp: attrResult.xp })
      .eq('id', attrRow.id)

    if (leveledUp) {
      alert(`🎉 Level Up! You are now Level ${level}!`)
    } else {
      alert(`+${task.xp_value} XP earned!`)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h1>Your Quests</h1>
      <form onSubmit={addTask} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New quest..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <select value={attribute} onChange={(e) => setAttribute(e.target.value)} style={{ padding: 8, marginRight: 8 }}>
          <option>Focus</option>
          <option>Intellect</option>
          <option>Wellness</option>
        </select>
        <button type="submit" style={{ padding: 8 }}>Add</button>
      </form>

      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, borderBottom: '1px solid #ccc' }}>
          <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
            {task.title} ({task.attribute}) — {task.xp_value} XP
          </span>
          <div>
            <button onClick={() => completeTask(task)} disabled={task.is_completed} style={{ marginRight: 8 }}>
              {task.is_completed ? 'Done' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}