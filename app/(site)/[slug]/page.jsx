import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { formatDate, getPost, rich } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: { title: post.title, type: 'article', images: post.image ? [post.image.src] : undefined },
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const d = formatDate(post.date);
  const cat = post.categories[0];
  return (
    <article className="post">
      <div className="post-inner">
        <h1>{post.title}</h1>
        <div className="post-card-meta">
          <span>
            <Icon name="calendar" size={20} />
            {d.longa}
          </span>
          {cat ? (
            <Link href={`/category/${cat.slug}/`}>
              <Icon name="folders" size={20} />
              {cat.name}
            </Link>
          ) : null}
        </div>
        {post.image ? <img className="post-cover" src={post.image.src} alt={post.image.alt} /> : null}
        {post.content ? <div className="post-content" dangerouslySetInnerHTML={{ __html: rich(post.content) }} /> : null}
        <Link className="btn btn-navy" href="/noticias/">
          <span>Todas as notícias</span>
          <Icon name="arrow-up-right" size={15} />
        </Link>
      </div>
    </article>
  );
}
