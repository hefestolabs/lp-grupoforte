export default function PageHero({ title, image, overlay = 0.8, position = 'center' }) {
  return (
    <section className="page-hero-wrap">
      <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,59,110,${overlay}),rgba(0,59,110,${overlay})),url(${image})`, backgroundPosition: position }}>
        <h1 data-reveal="full">{title}</h1>
      </div>
    </section>
  );
}
