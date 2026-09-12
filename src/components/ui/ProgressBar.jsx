import './ProgressBar.css';

// value: 0 to 1. color: 'sage' | 'butter' | 'pink' (matches token names)
export default function ProgressBar({ value, color = 'butter', label }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="progress-wrap">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-track">
        <div
          className={`progress-fill progress-${color}`}
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>
    </div>
  );
}
