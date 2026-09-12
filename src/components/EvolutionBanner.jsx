import Card from './ui/Card';
import './EvolutionBanner.css';

export default function EvolutionBanner({ stage }) {
  if (!stage) return null;

  return (
    <div className="evolution-banner-overlay">
      <Card className="evolution-banner pop-in">
        <span className="evolution-banner-emoji">🌱✨</span>
        <h3>Your companion evolved!</h3>
        <p>Say hello to your <strong>{stage.label}</strong></p>
      </Card>
    </div>
  );
}
