
function CategoryFilter({ categorias, activa, onChange }) {
  return (
    <div className="filtro" role="group" aria-label="Filtrar por categoría">
      {['Todas', ...categorias].map((cat) => (
        <button
          key={cat}
          className={'filtro__boton' + (activa === cat ? ' filtro__boton--activo' : '')}
          onClick={() => onChange(cat)}
          aria-pressed={activa === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
