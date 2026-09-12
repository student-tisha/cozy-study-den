import Companion from './Companion';
import TaskList from './TaskList';
import Card from './ui/Card';
import CompanionSkeleton from './skeletons/CompanionSkeleton';
import TaskListSkeleton from './skeletons/TaskListSkeleton';
import ErrorState from './ErrorState';
import { getMotivation } from '../state/copy';
import { getEquippedVisuals } from '../state/shopLogic';
import './TasksPage.css';

export default function TasksPage({ state, tasksStatus, onCompleteTask, onRetryTasks }) {
  // ── API loading / slow network ──
  if (tasksStatus === 'loading') {
    return (
      <div className="tasks-page">
        <div className="tasks-page-grid">
          <TaskListSkeleton />
          <CompanionSkeleton compact />
        </div>
      </div>
    );
  }

  // ── API error ──
  if (tasksStatus === 'error') {
    return (
      <div className="tasks-page">
        <ErrorState
          title="Couldn't load your rituals"
          message="We couldn't reach the server. Nothing you've already completed today was lost."
          onRetry={onRetryTasks}
        />
      </div>
    );
  }

  const doneCount = state.tasks.filter((t) => t.done).length;
  const total = state.tasks.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="tasks-page">
      <header className="tasks-page-header fade-in">
        <h1>Today's Rituals</h1>
        <p className="tasks-page-subtitle">{getMotivation(doneCount, total)}</p>
      </header>

      {/* Explicit counter + percentage, called out separately from the
          progress bar inside TaskList so both requirements are clearly
          visible, not just implied by a bar's width. Skipped entirely
          when there are no tasks — a "0/0, 0%" stat is just noise on
          top of the empty state TaskList already shows. */}
      {total > 0 && (
        <Card className="tasks-summary-card slide-up">
          <div className="tasks-summary-item">
            <span className="tasks-summary-value">{doneCount}/{total}</span>
            <span className="tasks-summary-label">Rituals completed</span>
          </div>
          <div className="tasks-summary-divider" />
          <div className="tasks-summary-item">
            <span className="tasks-summary-value">{percent}%</span>
            <span className="tasks-summary-label">Today's completion</span>
          </div>
        </Card>
      )}

      <div className="tasks-page-grid">
        <TaskList tasks={state.tasks} onComplete={onCompleteTask} />
        {/* Compact companion here proves the "companion receives the
            growth event" requirement visually on this screen too —
            completing a task above makes this card pulse. */}
        <Companion xp={state.xp} streak={state.streak} compact visuals={getEquippedVisuals(state.equipped)} />
      </div>
    </div>
  );
}
