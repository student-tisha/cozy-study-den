import './Input.css';

export default function Input({ label, id, ...rest }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input id={id} className="input-field" {...rest} />
    </div>
  );
}
