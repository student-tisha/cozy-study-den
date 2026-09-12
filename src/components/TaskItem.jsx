import { useEffect, useRef, useState } from 'react';
import Badge from './ui/Badge';

export default function TaskItem({ task, onComplete }) {
  // Local, short-lived animation flag — purely visual, not app state.
  // Doesn't need to live in App because nothing else depends on it.
  const [justCompleted, setJustCompleted] = useState(false);

  // Synchronous double-click / double-tap guard. `disabled={task.done}`
  // below only takes effect once React re-renders with the updated
  // task — there's a real gap between the first click and that
  // repaint where a second click event can still reach this handler.
  // A ref mutates instantly (no render involved), so checking it here
  // closes that gap immediately, regardless of render timing.
  const lockedRef = useRef(task.done);

  // Keep the ref in sync when `task.done` changes for reasons other
  // than this click (e.g. a new day resets `done` back to false) so
  // the task can be completed again later instead of staying locked.
  useEffect(() => {
    lockedRef.current = task.done;
  }, [task.done]);

  function handleClick() {
    if (lockedRef.current) return;
    lockedRef.current = true;

    setJustCompleted(true);
    onComplete(task.id);
    setTimeout(() => setJustCompleted(false), 500);
  }

  return (
    <li className={`task-item ${task.done ? 'task-done' : ''} ${justCompleted ? 'task-item-celebrate' : ''}`}>
      <button
        className="task-checkbox press"
        onClick={handleClick}
        disabled={task.done}
        aria-label={task.done ? `${task.title} completed` : `Complete ${task.title}`}
      >
        {task.done ? '✓' : ''}
      </button>
      <span className="task-title">{task.title}</span>
      <Badge tone="butter">+{task.xpValue} XP</Badge>
    </li>
  );
}
