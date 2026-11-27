// Banner do topo das páginas internas
export default function PageHero({ title, image, overlay = 0.8, position = 'center', edit }) {
  return (
    <section className="page-hero-wrap" data-edit={edit}>
      <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,59,110,${overlay}),rgba(0,59,110,${overlay})),url(${image || '/img/bg-soft.jpg'})`, backgroundPosition: position }}>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
