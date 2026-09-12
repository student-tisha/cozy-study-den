import Companion from './Companion';
import TaskList from './TaskList';
import DashboardSkeleton from './skeletons/DashboardSkeleton';
import ErrorState from './ErrorState';
import { getGreeting, getMotivation } from '../state/copy';
import { getEquippedVisuals } from '../state/shopLogic';
import './Dashboard.css';

export default function Dashboard({ state, tasksStatus, onCompleteTask, onRetryTasks }) {
  // ── API loading / slow network ──
  // Same skeleton whether the fetch is fast or slow — the user never
  // sees a blank screen or a bare "Loading..." text either way.
  if (tasksStatus === 'loading') {
    return <DashboardSkeleton />;
  }

  // ── API error ──
  if (tasksStatus === 'error') {
    return (
      <div className="dashboard">
        <ErrorState
          title="Couldn't load your dashboard"
          message="We couldn't reach the server to load today's rituals. Your XP and companion are safe."
          onRetry={onRetryTasks}
        />
      </div>
    );
  }

  const doneCount = state.tasks.filter((t) => t.done).length;
  const motivation = getMotivation(doneCount, state.tasks.length);

  return (
    <div className="dashboard">
      {/* ── Greeting: the first thing a new user reads, sets context
          for everything else in under 5 seconds. ── */}
      <header className="dashboard-header fade-in">
        <h1>{getGreeting()}, {state.userName} 👋</h1>
        <p className="dashboard-motivation">{motivation}</p>
      </header>

      {/* ── Companion + Tasks side by side on desktop, stacked below
          tablet width. Companion leads because it's the emotional
          hook; tasks are the action the user takes next. ── */}
      <div className="dashboard-grid">
        <Companion xp={state.xp} streak={state.streak} visuals={getEquippedVisuals(state.equipped)} />
        <TaskList tasks={state.tasks} onComplete={onCompleteTask} />
      </div>
    </div>
  );
}
