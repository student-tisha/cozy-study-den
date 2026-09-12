import Card from './ui/Card';
import Button from './ui/Button';

export default function EmptyState({ emoji = '🌱', title, message, actionLabel, onAction }) {
  return (
    <Card className="fade-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
      <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-2)' }}>{emoji}</div>
      <h3 style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p style={{ color: 'var(--soil-brown-soft)', marginBottom: actionLabel ? 'var(--space-4)' : 0 }}>
        {message}
      </p>
      {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
    </Card>
  );
}
