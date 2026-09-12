import './NavBar.css';

// items: [{ label, active, onClick }]
export default function NavBar({ items = [] }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <span className="navbar-brand">🌱 Sprout</span>
        <div className="navbar-links">
          {items.map((item) => (
            <button
              key={item.label}
              className={`navbar-link ${item.active ? 'navbar-link-active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
