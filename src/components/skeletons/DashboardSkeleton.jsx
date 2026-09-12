import CompanionSkeleton from './CompanionSkeleton';
import TaskListSkeleton from './TaskListSkeleton';
import { SkeletonBlock } from '../ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="dashboard" aria-busy="true" aria-label="Loading dashboard">
      <header className="dashboard-header">
        <SkeletonBlock width="220px" height="28px" />
        <div style={{ marginTop: 'var(--space-2)' }}>
          <SkeletonBlock width="280px" height="16px" />
        </div>
      </header>

      <div className="dashboard-grid">
        <CompanionSkeleton />
        <TaskListSkeleton />
      </div>
    </div>
  );
}
