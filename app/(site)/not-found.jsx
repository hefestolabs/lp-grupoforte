import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="post">
      <div className="post-inner">
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe ou foi movido.</p>
        <Link className="btn btn-navy" href="/">Voltar para a home</Link>
      </div>
    </section>
  );
}
