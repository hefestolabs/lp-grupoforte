// Marcadores de carregamento (skeleton). Sem estado: podem ser usados no servidor e no cliente.
function Sk({ w = '100%', h = 14, r = 6, style }) {
  return <span className="sk" aria-hidden="true" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

// Cartão de formulário: título e alguns campos.
export function CardSkeleton({ fields = 3 }) {
  return (
    <div className="p-card p-card--open sk-card" role="status" aria-label="Carregando">
      <Sk w="38%" h={20} />
      {Array.from({ length: fields }, (_, i) => (
        <div className="sk-field" key={i}>
          <Sk w="30%" h={12} />
          <Sk h={42} r={8} />
        </div>
      ))}
      <Sk w={120} h={42} r={8} />
    </div>
  );
}
// Linhas de lista (notícias, demandas, acessos).
export function RowsSkeleton({ rows = 3 }) {
  return (
    <div className="sk-rows" role="status" aria-label="Carregando">
      {Array.from({ length: rows }, (_, i) => (
        <div className="sk-row" key={i}>
          <Sk w={56} h={40} r={6} />
          <span>
            <Sk w="60%" />
            <Sk w="35%" h={11} />
          </span>
        </div>
      ))}
    </div>
  );
}
// Editor visual: barra, lista de partes e prévia.
export function EditorSkeleton() {
  return (
    <div className="sk-editor" role="status" aria-label="Carregando o editor">
      <div className="sk-editor-bar" />
      <div className="sk-editor-body">
        <div className="sk-editor-side">
          {Array.from({ length: 7 }, (_, i) => (
            <Sk key={i} h={44} r={8} />
          ))}
        </div>
        <div className="sk-editor-main">
          <PreviewSkeleton />
        </div>
      </div>
    </div>
  );
}
// Prévia do site dentro do editor.
export function PreviewSkeleton() {
  return (
    <div className="sk-preview" aria-hidden="true">
      <Sk h={46} r={0} />
      <Sk h="38%" r={0} />
      <div className="sk-preview-cols">
        <Sk h={110} />
        <Sk h={110} />
        <Sk h={110} />
      </div>
      <Sk w="50%" h={18} />
      <Sk w="80%" />
      <Sk w="70%" />
    </div>
  );
}
// Estrutura do painel no primeiro carregamento.
export function ShellSkeleton() {
  return (
    <div className="p-app sk-shell" role="status" aria-label="Carregando o painel">
      <aside className="p-side">
        <div className="p-side-top">
          <Sk w={150} h={30} style={{ opacity: 0.25 }} />
        </div>
        <nav>
          {Array.from({ length: 5 }, (_, i) => (
            <Sk key={i} h={38} r={8} style={{ opacity: 0.18 }} />
          ))}
        </nav>
      </aside>
      <div className="p-body">
        <main className="p-main">
          <Sk w="45%" h={30} />
          <Sk w="65%" style={{ marginTop: 14 }} />
          <div className="sk-grid">
            {Array.from({ length: 4 }, (_, i) => (
              <Sk key={i} h={96} r={12} />
            ))}
          </div>
          <CardSkeleton fields={2} />
        </main>
      </div>
    </div>
  );
}
