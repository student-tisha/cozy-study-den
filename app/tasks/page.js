'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { applyXp, calculateStreak } from '../../lib/gameLogic'
import LevelUpCelebration from '../../components/LevelUpCelebration'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [attribute, setAttribute] = useState('Focus')
  const [userId, setUserId] = useState(null)
  const [levelUp, setLevelUp] = useState({ show: false, level: null })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

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
      .insert({
        user_id: userId,
        title,
        attribute,
        xp_value: 10
      })
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

    await supabase
      .from('tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', task.id)

    setTasks(
      tasks.map(t =>
        t.id === task.id ? { ...t, is_completed: true } : t
      )
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('level, xp, streak_count, last_active_date, currency')
      .eq('id', userId)
      .single()

    const { level, xp, leveledUp } = applyXp(
      profile.level,
      profile.xp,
      task.xp_value
    )

    const { streak, lastActiveDate } = calculateStreak(
      profile.last_active_date,
      profile.streak_count
    )

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

    let { data: attrRow } = await supabase
      .from('attributes')
      .select('*')
      .eq('user_id', userId)
      .eq('attribute_name', task.attribute)
      .single()

    if (!attrRow) {
      const { data: newAttr } = await supabase
        .from('attributes')
        .insert({
          user_id: userId,
          attribute_name: task.attribute
        })
        .select()
        .single()

      attrRow = newAttr
    }

    const attrResult = applyXp(
      attrRow.attribute_level,
      attrRow.attribute_xp,
      task.xp_value
    )

    await supabase
      .from('attributes')
      .update({
        attribute_level: attrResult.level,
        attribute_xp: attrResult.xp
      })
      .eq('id', attrRow.id)

    if (leveledUp) {
      setLevelUp({ show: true, level })
    } else {
      alert(`+${task.xp_value} XP earned!`)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cozy-bg)] px-5 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          {/* <h1 className="text-4xl font-bold text-[var(--cozy-ink)]">
            Your Quests
          </h1> */}
          <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
           <a href="/dashboard" style={{ padding: '8px 16px', background: '#eee', borderRadius: 8, textDecoration: 'none', color: '#333', fontSize: 14 }}>Dashboard</a>
           <a href="/shop" style={{ padding: '8px 16px', background: '#eee', borderRadius: 8, textDecoration: 'none', color: '#333', fontSize: 14 }}>Shop</a>
           </nav>
            <h1>Your Quests</h1>

          <p className="mt-2 text-[var(--cozy-ink-soft)]">
            Complete quests, earn XP, and level up.
          </p>
        </div>

        <form
          onSubmit={addTask}
          className="mb-8 rounded-[var(--cozy-radius-lg)] border border-[var(--cozy-border)] bg-[var(--cozy-surface)] p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              placeholder="New quest..."
              aria-label="New quest title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-[var(--cozy-radius-sm)] border border-[var(--cozy-border)] bg-white px-4 py-3 text-[var(--cozy-ink)] outline-none placeholder:text-[var(--cozy-ink-soft)] focus:border-[var(--cozy-honey-dark)] focus:ring-2 focus:ring-[var(--cozy-honey)]/30"
            />

            <select
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              aria-label="Quest attribute category"
              className="rounded-[var(--cozy-radius-sm)] border border-[var(--cozy-border)] bg-white px-4 py-3 text-[var(--cozy-ink)] outline-none focus:border-[var(--cozy-honey-dark)] focus:ring-2 focus:ring-[var(--cozy-honey)]/30"
            >
              <option>Focus</option>
              <option>Intellect</option>
              <option>Wellness</option>
            </select>

            <button
              type="submit"
              className="rounded-[var(--cozy-radius-sm)] bg-[var(--cozy-honey)] px-5 py-3 font-semibold text-[var(--cozy-ink)] transition hover:bg-[var(--cozy-honey-dark)]"
            >
              Add
            </button>

          </div>
        </form>

        <div className="space-y-3">

          {tasks.map(task => (
            <div
              key={task.id}
              className="flex flex-col gap-4 rounded-[var(--cozy-radius-md)] border border-[var(--cozy-border)] bg-[var(--cozy-surface)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >

              <span
                className={`text-[var(--cozy-ink)] ${
                  task.is_completed
                    ? 'text-[var(--cozy-ink-soft)] line-through'
                    : ''
                }`}
              >
                {task.title} ({task.attribute}) — {task.xp_value} XP
              </span>

              <div className="flex gap-2">

                <button
                  onClick={() => completeTask(task)}
                  disabled={task.is_completed}
                  aria-label={`Complete quest: ${task.title}`}
                  className={`rounded-[var(--cozy-radius-sm)] px-4 py-2 text-sm font-semibold transition ${
                    task.is_completed
                      ? 'cursor-not-allowed bg-[var(--cozy-border)] text-[var(--cozy-ink-soft)]'
                      : 'bg-[var(--cozy-sage)] text-white hover:opacity-90'
                  }`}
                >
                  {task.is_completed ? 'Done' : 'Complete'}
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete quest: ${task.title}`}
                  className="rounded-[var(--cozy-radius-sm)] border border-[var(--cozy-border)] px-4 py-2 text-sm font-semibold text-[var(--cozy-error)] transition hover:bg-[var(--cozy-error)]/10"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

        <LevelUpCelebration
          show={levelUp.show}
          level={levelUp.level}
          onDismiss={() =>
            setLevelUp({ show: false, level: null })
          }
        />

      </div>
    </div>
  )
}