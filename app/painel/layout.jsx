import './painel.css';

export const metadata = { title: 'Painel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function PainelLayout({ children }) {
  return <div className="painel">{children}</div>;
}
