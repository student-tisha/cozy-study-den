import Card from '../ui/Card';
import { SkeletonBlock, SkeletonCircle } from '../ui/Skeleton';

export default function TaskListSkeleton({ rows = 4 }) {
  return (
    <Card aria-busy="true" aria-label="Loading tasks">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <SkeletonBlock width="140px" height="22px" />
        <SkeletonBlock width="60px" height="16px" />
      </div>

      <SkeletonBlock width="100%" height="12px" radius="var(--radius-full)" />

      <ul style={{ listStyle: 'none', margin: 'var(--space-4) 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--cream)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
            }}
          >
            <SkeletonCircle size="28px" />
            <SkeletonBlock width={`${55 + (i % 3) * 10}%`} height="16px" />
            <SkeletonBlock width="52px" height="20px" radius="var(--radius-full)" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
