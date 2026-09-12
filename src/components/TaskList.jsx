import TaskItem from './TaskItem';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import './TaskList.css';

export default function TaskList({ tasks, onComplete }) {
  const doneCount = tasks.filter((t) => t.done).length;
  const dailyProgress = tasks.length === 0 ? 0 : doneCount / tasks.length;
  const isEmpty = tasks.length === 0;

  return (
    <Card className="task-list-card slide-up">
      <div className="task-list-header">
        <h2>Today's Rituals</h2>
        <span className="task-count">{doneCount}/{tasks.length} done</span>
      </div>

      {!isEmpty && <ProgressBar value={dailyProgress} color="sage" label="Today's progress" />}

      {isEmpty ? (
        // Empty state: no rituals yet — not a blank list, and not an
        // error, so it gets its own friendly message + call to action.
        <div className="task-list-empty">
          <span className="task-list-empty-emoji">🌱</span>
          <p className="task-list-empty-title">No rituals yet today</p>
          <p className="task-list-empty-message">
            Add your first ritual to start growing your companion.
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onComplete={onComplete} />
          ))}
        </ul>
      )}
    </Card>
  );
}
