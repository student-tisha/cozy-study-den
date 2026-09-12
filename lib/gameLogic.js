// XP required to reach a given level (non-linear curve)
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5))
}

// Given current level + xp, and xp just earned, returns updated level/xp
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
