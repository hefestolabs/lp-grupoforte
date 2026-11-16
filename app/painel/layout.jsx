import './painel.css';
import './tema.css';

export const metadata = { title: 'Painel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function PainelLayout({ children }) {
  // Aplica o tema salvo antes do primeiro paint (padrão: escuro).
  const script = "try{var t=localStorage.getItem('gf-tema');document.documentElement.dataset.ptheme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.ptheme='dark'}";
  return (
    <div className="painel">
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {children}
    </div>
  );
}
