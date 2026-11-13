import Eyebrow from '@/components/Eyebrow';
import PostGrid from '@/components/PostGrid';
import { getPosts } from '@/lib/data';

export const metadata = { title: 'Notícias', description: 'Novidades, lançamentos e tendências do Grupo Forte.' };

export default async function Noticias() {
  const { posts } = await getPosts({ perPage: 30 });
  return (
    <section className="noticias noticias--page">
      <div className="container">
        <div className="noticias-head">
          <div>
            <Eyebrow className="eyebrow--plain">Notícias e insights</Eyebrow>
            <h1 className="h-light h-navy">Fique por dentro das novidades, lançamentos e tendências...</h1>
          </div>
        </div>
        <PostGrid posts={posts} />
      </div>
    </section>
  );
}
