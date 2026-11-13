import icons from '@/lib/icons.json';

// Ícones do site original convertidos para SVG (sem fontes de ícone).
export default function Icon({ name, size = 20, className = '', title }) {
  const ic = icons[name];
  if (!ic) return null;
  const viewBox = ic.vb || `0 0 ${ic.w} ${ic.h}`;
  return (
    <svg className={`icon ${className}`} viewBox={viewBox} width={size} height={size} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d={ic.d} />
    </svg>
  );
}
