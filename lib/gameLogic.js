export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function applyXp(currentLevel, currentXp, earnedXp) {
  let level = currentLevel
  let xp = currentXp + earnedXp
  let leveledUp = false

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level)
    level += 1
    leveledUp = true
  }

  return { level, xp, leveledUp }
}

export function calculateStreak(lastActiveDate, currentStreak) {
  const today = new Date().toISOString().split('T')[0]

  if (!lastActiveDate) {
    return { streak: 1, lastActiveDate: today }
  }

  if (lastActiveDate === today) {
    return { streak: currentStreak, lastActiveDate: today }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastActiveDate === yesterdayStr) {
    return { streak: currentStreak + 1, lastActiveDate: today }
  }

  return { streak: 1, lastActiveDate: today }
}