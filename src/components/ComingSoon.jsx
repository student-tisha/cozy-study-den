import Card from './ui/Card';

export default function ComingSoon({ label }) {
  return (
    <div className="container" style={{ paddingTop: 'var(--space-6)' }}>
      <Card className="fade-in" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>{label}</h2>
        <p style={{ color: 'var(--soil-brown-soft)' }}>
          This screen is coming in a later milestone.
        </p>
      </Card>
    </div>
  );
}
