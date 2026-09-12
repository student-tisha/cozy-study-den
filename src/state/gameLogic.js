// ══════════════════════════════════════════════════════════════════
// GROWTH SYSTEM — the signature gamification feature.
//
// Two numbers drive the companion, and they are kept DELIBERATELY
// independent of each other:
//
//   XP     → PERMANENT GROWTH   (how big/evolved the plant is — never
//                                 goes down, ever)
//   STREAK → CURRENT CONDITION  (how the plant looks/feels right now —
//                                 can drop to zero without touching XP)
//
// This is why missing a day never resets the plant back to a seed.
// The two systems below never read from or write to each other.
// ══════════════════════════════════════════════════════════════════

// ── 1. Growth stage config — the ONLY place thresholds/names live ──
// Change a number or label here and every part of the UI (progress
// bar, "next evolution" text, celebration banner) updates automatically,
// because they all derive from this array — nothing else hardcodes a
// threshold or a stage name.
export const GROWTH_STAGES = [
  { id: 'seed', label: 'Seed', minXp: 0 },
  { id: 'sprout', label: 'Sprout', minXp: 100 },
  { id: 'young', label: 'Young Plant', minXp: 300 },
  { id: 'growing', label: 'Growing Plant', minXp: 600 },
  { id: 'flowering', label: 'Flowering Plant', minXp: 1000 },
  { id: 'final', label: 'Mature / Final Form', minXp: 2000 },
];

// ── 2. getGrowthStage(xp) ───────────────────────────────────────────
// Algorithm: walk the stages in ascending threshold order, and keep
// remembering the last one whose minXp the user has reached. The loop
// never breaks early, so the LAST match wins — i.e. the highest stage
// whose threshold is <= xp. Because GROWTH_STAGES is sorted ascending
// and xp only ever increases (see completeTask below), the result of
// this function can only ever move forward over time, never backward.
//
// Example walk-through for xp = 450:
//   seed (0)      → 450 >= 0   → current = seed
//   sprout (100)  → 450 >= 100 → current = sprout
//   young (300)   → 450 >= 300 → current = young
//   growing (600) → 450 >= 600 is false → current stays "young"
//   ...loop finishes, still "young"
// Result: Young Plant. That matches the brief's example table exactly.
export function getGrowthStage(xp) {
  let current = GROWTH_STAGES[0];
  for (const stage of GROWTH_STAGES) {
    if (xp >= stage.minXp) current = stage;
  }
  return current;
}

// ── 3. getGrowthProgress(xp) ────────────────────────────────────────
// Everything the UI needs to render "progress toward next stage" and
// "next evolution requirement" in one call, so components never have
// to re-derive this logic themselves.
//
// Returns:
//   stage          — the current GROWTH_STAGES entry (from getGrowthStage)
//   nextStage      — the next entry, or null if already at the final stage
//   percent        — 0..1, how far through the CURRENT stage's XP span
//   xpIntoStage    — XP earned since entering the current stage
//   xpForNextStage — XP still needed to reach nextStage (null if maxed)
export function getGrowthProgress(xp) {
  const stage = getGrowthStage(xp);
  const idx = GROWTH_STAGES.indexOf(stage);
  const nextStage = GROWTH_STAGES[idx + 1] ?? null;

  if (!nextStage) {
    // Already at the final form — nothing left to grow toward.
    return { stage, nextStage: null, percent: 1, xpIntoStage: xp - stage.minXp, xpForNextStage: null };
  }

  const xpIntoStage = xp - stage.minXp;
  const spanForThisStage = nextStage.minXp - stage.minXp;

  return {
    stage,
    nextStage,
    percent: xpIntoStage / spanForThisStage,
    xpIntoStage,
    xpForNextStage: nextStage.minXp - xp,
  };
}

// ── Streak mood (CURRENT CONDITION — completely separate system) ────
// Notice: nothing in this section reads GROWTH_STAGES or xp, and
// nothing above reads streak. That separation is what the brief means
// by "the companion should not completely reset when a streak is
// broken" — a broken streak can only ever change STREAK_STATUSES,
// never GROWTH_STAGES.
export const STREAK_STATUSES = {
  droopy: { id: 'droopy', label: 'Slightly Droopy', minStreak: 0 },
  normal: { id: 'normal', label: 'Normal', minStreak: 1 },
  energetic: { id: 'energetic', label: 'Energetic', minStreak: 3 },
  healthy: { id: 'healthy', label: 'Healthy', minStreak: 7 },
};

export function getStreakStatus(streak) {
  if (streak >= STREAK_STATUSES.healthy.minStreak) return STREAK_STATUSES.healthy;
  if (streak >= STREAK_STATUSES.energetic.minStreak) return STREAK_STATUSES.energetic;
  if (streak >= STREAK_STATUSES.normal.minStreak) return STREAK_STATUSES.normal;
  return STREAK_STATUSES.droopy;
}

// ── The core loop: completing a task ──
// Takes the current app state + a task id, returns a NEW state object
// (never mutates the old one — this is what makes optimistic updates
// safe later: we can compute the "optimistic" state instantly, then
// reconcile with the server response). xp only ever increases here,
// which is the guarantee getGrowthStage's algorithm relies on.
export function completeTask(state, taskId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.done) return state; // already done, or not found — no-op

  const updatedTasks = state.tasks.map((t) =>
    t.id === taskId ? { ...t, done: true } : t
  );

  return {
    ...state,
    tasks: updatedTasks,
    xp: state.xp + task.xpValue,
    coins: state.coins + Math.round(task.xpValue / 2), // shop currency, simple ratio
  };
}

// Call this once daily (or on app load, comparing lastActiveDate) to bump
// the streak. Kept separate from completeTask on purpose: streak is a
// per-day concept, XP is a per-task concept. Note this touches `streak`
// only — xp is never read or written here, so a reset streak can never
// undo growth.
export function advanceStreakIfNewDay(state, today = new Date().toDateString()) {
  if (state.lastActiveDate === today) return state; // already counted today
  const allDoneYesterday = state.tasks.every((t) => t.done);
  return {
    ...state,
    streak: allDoneYesterday ? state.streak + 1 : 0,
    lastActiveDate: today,
    tasks: state.tasks.map((t) => ({ ...t, done: false })), // reset for new day
  };
}
