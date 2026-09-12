import Card from '../ui/Card';
import { SkeletonBlock, SkeletonCircle } from '../ui/Skeleton';

export default function ShopSkeleton({ items = 4 }) {
  return (
    <div aria-busy="true" aria-label="Loading shop">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <SkeletonBlock width="140px" height="24px" />
        <SkeletonBlock width="90px" height="24px" radius="var(--radius-full)" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {Array.from({ length: items }).map((_, i) => (
          <Card key={i} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
              <SkeletonCircle size="56px" />
            </div>
            <SkeletonBlock width="80%" height="16px" />
            <div style={{ margin: 'var(--space-2) 0' }}>
              <SkeletonBlock width="50%" height="14px" />
            </div>
            <SkeletonBlock width="100%" height="36px" radius="var(--radius-md)" />
          </Card>
        ))}
      </div>
    </div>
  );
}
