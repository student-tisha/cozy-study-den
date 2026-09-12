import Card from './ui/Card';
import Button from './ui/Button';

export default function ErrorState({
  title = "Couldn't load that",
  message = 'Something went wrong reaching the server. Your progress is safe — just try again.',
  onRetry,
}) {
  return (
    <Card className="fade-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
      <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-2)' }}>🥀</div>
      <h3 style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p style={{ color: 'var(--soil-brown-soft)', marginBottom: 'var(--space-4)' }}>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </Card>
  );
}
