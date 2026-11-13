import Link from 'next/link';
import Icon from './Icon';

export default function Footer({ c }) {
  return (
    <>
      <footer className="footer-wrap">
        <div className="footer panel-navy">
          <div className="footer-inner">
            <img className="footer-logo" src="/img/logo-branco.png" alt="Grupo Forte" width="300" height="86" />
            <hr />
            <div className="footer-cols">
              <div className="footer-brand">
                <h4>GRUPO FORTE</h4>
                <p>{c.slogan}</p>
                <ul className="socials">
                  {c.facebook ? <li><a href={c.facebook} target="_blank" rel="noopener"><Icon name="e-fab-facebook" size={25} title="Facebook" /></a></li> : null}
                  {c.vagas ? <li><a href={c.vagas} target="_blank" rel="noopener"><Icon name="e-fab-linkedin" size={25} title="Linkedin" /></a></li> : null}
                  {c.instagram ? <li><a href={c.instagram} target="_blank" rel="noopener"><Icon name="e-fab-instagram" size={25} title="Instagram" /></a></li> : null}
                  {c.youtube ? <li><a href={c.youtube} target="_blank" rel="noopener"><Icon name="e-fab-youtube" size={25} title="Youtube" /></a></li> : null}
                </ul>
              </div>
              <div className="footer-contact">
                <h4 className="footer-title">CONTATO</h4>
                <ul>
                  <li><a href={`mailto:${c.email}`}>E-mail: {c.email}</a></li>
                  <li><a href={c.whatsapp}>Telefone: {c.telefone}</a></li>
                  <li>{c.endereco}</li>
                </ul>
              </div>
              <div className="footer-info">
                <h4 className="footer-title">INFORMAÇÕES</h4>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/sobre-nos/">Sobre nós</Link></li>
                  <li><Link href="/produtos/">Produtos</Link></li>
                  <li><Link href="/trabalhe-conosco/">Trabalhe Conosco</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright">
        <p>{c.copyright}</p>
      </div>
    </>
  );
}
