import { useState } from 'react';
import NavBar from './components/ui/NavBar';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import ProgressBar from './components/ui/ProgressBar';
import Badge from './components/ui/Badge';

const swatches = [
  ['--cream', 'Cream (bg)'],
  ['--card-white', 'Card White'],
  ['--sage', 'Sage'],
  ['--sage-dark', 'Sage Dark'],
  ['--sage-light', 'Sage Light'],
  ['--terracotta-pink', 'Terracotta Pink'],
  ['--butter', 'Butter'],
  ['--soil-brown', 'Soil Brown'],
];

export default function DesignSystemPreview() {
  const [tab, setTab] = useState('Home');

  return (
    <div className="fade-in">
      <NavBar
        items={['Home', 'Tasks', 'Shop'].map((label) => ({
          label,
          active: tab === label,
          onClick: () => setTab(label),
        }))}
      />

      <div className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-5)' }}>Design System Preview</h1>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Color palette</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {swatches.map(([varName, name]) => (
              <div key={varName} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-md)',
                    background: `var(${varName})`,
                    boxShadow: 'var(--shadow-soft)',
                  }}
                />
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Typography</h2>
          <Card>
            <h1>Heading 1 — Quicksand</h1>
            <h2>Heading 2 — Quicksand</h2>
            <h3>Heading 3 — Quicksand</h3>
            <p style={{ marginTop: 'var(--space-3)' }}>
              Body text uses Nunito — soft, legible, friendly at small sizes.
            </p>
            <p style={{ color: 'var(--soil-brown-soft)', fontSize: 'var(--text-sm)' }}>
              Secondary/muted text for hints and metadata.
            </p>
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Buttons</h2>
          <Card style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Inputs</h2>
          <Card style={{ maxWidth: 320 }}>
            <Input label="Task name" placeholder="e.g. Drink water" />
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Progress bars</h2>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 320 }}>
            <ProgressBar value={0.7} color="butter" label="XP to next stage" />
            <ProgressBar value={0.4} color="sage" label="Sage variant" />
            <ProgressBar value={0.85} color="pink" label="Pink variant" />
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Badges</h2>
          <Card style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="sage">🔥 7 day streak</Badge>
            <Badge tone="butter">+20 XP</Badge>
            <Badge tone="pink">New!</Badge>
          </Card>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Animation utilities</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Card className="pop-in">pop-in</Card>
            <Card className="slide-up">slide-up</Card>
            <Card className="sway">sway (loops)</Card>
          </div>
        </section>
      </div>
    </div>
  );
}
