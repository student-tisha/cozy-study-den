import './Button.css';

// variant: 'primary' | 'secondary' | 'ghost'
export default function Button({ children, variant = 'primary', ...rest }) {
  return (
    <button className={`btn btn-${variant} press`} {...rest}>
      {children}
    </button>
  );
}
