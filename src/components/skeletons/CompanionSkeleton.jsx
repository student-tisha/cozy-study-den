import Card from '../ui/Card';
import { SkeletonBlock, SkeletonCircle } from '../ui/Skeleton';

export default function CompanionSkeleton({ compact = false }) {
  return (
    <Card className="companion-card" aria-busy="true" aria-label="Loading companion">
      <div className="companion-card-header">
        <SkeletonBlock width="120px" height="22px" />
        <SkeletonBlock width="90px" height="24px" radius="var(--radius-full)" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-4) 0' }}>
        <SkeletonCircle size="140px" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <SkeletonBlock width="100px" height="18px" />
        <SkeletonBlock width="80px" height="14px" />
      </div>

      {!compact && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <SkeletonBlock width="100%" height="12px" radius="var(--radius-full)" />
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'center' }}>
            <SkeletonBlock width="160px" height="12px" />
          </div>
        </div>
      )}
    </Card>
  );
}
