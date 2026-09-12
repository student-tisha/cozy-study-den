import './Skeleton.css';

// A rectangular placeholder with the cozy shimmer sweep.
// width/height accept any CSS size string ('100%', '40px', etc).
export function SkeletonBlock({ width = '100%', height = '16px', radius, className = '' }) {
  return (
    <div
      className={`skeleton-block ${className}`}
      style={{ width, height, borderRadius: radius ?? 'var(--radius-sm)' }}
    />
  );
}

// A circular placeholder — used for the checkbox dots, avatar-ish
// shapes, and the plant "blob" in the Companion skeleton.
export function SkeletonCircle({ size = '32px', className = '' }) {
  return (
    <div
      className={`skeleton-block skeleton-circle ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
