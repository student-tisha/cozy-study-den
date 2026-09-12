import './DevNetworkToggle.css';

const OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'slow', label: 'Slow network' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'API error' },
];

// This entire component is a testing aid, not a product feature —
// it lets you preview all four data states (loading/slow/empty/error)
// with mock data before a real API exists. Delete this file and its
// one usage in App.jsx once the real API is wired up.
export default function DevNetworkToggle({ value, onChange }) {
  return (
    <div className="dev-network-toggle">
      <span>Simulate:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
