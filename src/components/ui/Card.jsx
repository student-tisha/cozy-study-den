import './Card.css';

// padded box with the app's signature rounded/soft-shadow look.
// Wrap any content in <Card> instead of redefining card CSS per screen.
export default function Card({ children, className = '', ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}
