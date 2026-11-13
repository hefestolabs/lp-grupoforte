import Link from 'next/link';
import Icon from './Icon';
import { SITE } from '@/lib/site';

export default function Footer() {
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
                <p>O forte da construção!</p>
                <ul className="socials">
                  <li><a href={SITE.facebook} target="_blank" rel="noopener"><Icon name="e-fab-facebook" size={25} title="Facebook" /></a></li>
                  <li><a href={SITE.vagas} target="_blank" rel="noopener"><Icon name="e-fab-linkedin" size={25} title="Linkedin" /></a></li>
                  <li><a href={SITE.instagram} target="_blank" rel="noopener"><Icon name="e-fab-instagram" size={25} title="Instagram" /></a></li>
                  <li><a href={SITE.youtube} target="_blank" rel="noopener"><Icon name="e-fab-youtube" size={25} title="Youtube" /></a></li>
                </ul>
              </div>
              <div className="footer-contact">
                <h4 className="footer-title">CONTATO</h4>
                <ul>
                  <li><a href={`mailto:${SITE.email}`}>E-mail: {SITE.email}</a></li>
                  <li><a href={SITE.whatsapp}>Telefone: {SITE.phone}</a></li>
                  <li>{SITE.address}</li>
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
        <p>{SITE.copyright}</p>
      </div>
    </>
  );
}
