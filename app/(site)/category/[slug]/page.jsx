import { notFound } from 'next/navigation';
import Eyebrow from '@/components/Eyebrow';
import PostGrid from '@/components/PostGrid';
import { getPosts } from '@/lib/data';


export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { category } = await getPosts({ category: slug });
  return category ? { title: category.name } : {};
}

export default async function Categoria({ params }) {
  const { slug } = await params;
  const { posts, category } = await getPosts({ category: slug, perPage: 30 });
  if (!category) notFound();
  return (
    <section className="noticias noticias--page">
      <div className="container">
        <div className="noticias-head">
          <div>
            <Eyebrow className="eyebrow--plain">Notícias e insights</Eyebrow>
            <h1 className="h-light h-navy">{category.name}</h1>
          </div>
        </div>
        <PostGrid posts={posts} />
      </div>
    </section>
  );
}
