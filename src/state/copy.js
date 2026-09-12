export function getGreeting(hour = new Date().getHours()) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Message changes based on how much of today's ritual list is done —
// this is what makes the dashboard feel alive rather than static.
export function getMotivation(doneCount, total) {
  if (total === 0) return 'Add a ritual to get started.';
  if (doneCount === 0) return 'Your plant is waiting — complete your first ritual today!';
  if (doneCount === total) return 'All rituals done! Your companion is thriving today. 🌿';
  const remaining = total - doneCount;
  return `Nice work — ${remaining} more ritual${remaining > 1 ? 's' : ''} to fully water your plant today.`;
}
