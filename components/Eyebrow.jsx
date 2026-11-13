import Icon from './Icon';

export default function Eyebrow({ children, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      <Icon name="e-far-dot-circle" size={20} />
      <span>{children}</span>
    </p>
  );
}
