import Link from 'next/link';
import Icon from './Icon';
import { formatDate } from '@/lib/data';

export default function PostGrid({ posts }) {
  if (!posts.length) return <p className="post-empty">Nenhuma notícia publicada ainda.</p>;
  return (
    <div className="post-grid">
      {posts.map((p) => {
        const d = formatDate(p.date);
        const cat = p.categories[0];
        return (
          <article className="post-card" key={p.slug}>
            <Link href={`/${p.slug}/`} className="post-card-img" aria-label={p.title}>
              {p.image ? <img src={p.image.src} alt={p.image.alt} loading="lazy" /> : null}
              <span className="post-card-badge"><b>{d.dia}</b>{d.mesCurto}</span>
            </Link>
            <div className="post-card-meta">
              <span><Icon name="calendar" size={20} />{d.longa}</span>
              {cat ? <Link href={`/category/${cat.slug}/`}><Icon name="folders" size={20} />{cat.name}</Link> : null}
            </div>
            <div className="post-card-foot">
              <h3><Link href={`/${p.slug}/`}>{p.title}</Link></h3>
              <Link href={`/${p.slug}/`} className="post-card-more" aria-label={`Ler: ${p.title}`}><Icon name="arrow-up-right" size={16} /></Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
