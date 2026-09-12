import { mockTasks } from '../data/mockTasks';

// ── Task service ──────────────────────────────────────────────────
// Every component that needs tasks calls these functions, never
// `mockTasks` directly. When the real API is ready, only THIS file
// changes — swap the bodies below for real `fetch()` calls, keep the
// same function names/return shapes, and no UI component needs to
// be touched.
//
// `simulate` is a dev-only knob (see DevNetworkToggle.jsx) used to
// preview how the UI behaves under different network conditions
// before a real API exists. Delete the `simulate` param when wiring
// up the real fetch() — everything else stays the same.

const DELAY_NORMAL_MS = 500;
const DELAY_SLOW_MS = 2500;

// Later: return fetch('/api/tasks').then(res => res.json())
export function fetchTasks({ simulate = 'normal' } = {}) {
  if (simulate === 'error') {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Could not reach the server.')), DELAY_NORMAL_MS);
    });
  }

  const delay = simulate === 'slow' ? DELAY_SLOW_MS : DELAY_NORMAL_MS;
  const data = simulate === 'empty' ? [] : mockTasks;
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// Later: return fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
//         .then(res => res.json())
// For now this doesn't do anything real — App still updates local state
// optimistically via completeTask() in gameLogic.js. This function exists
// so the call site already exists in App.jsx; the API milestone just
// fills in a real request here and handles the response/rollback.
export function submitTaskCompletion(taskId) {
  return Promise.resolve({ taskId, success: true });
}
