// Panel lateral: cada categoría es una casilla; se pueden marcar varias a la vez.
// Si no hay ninguna marcada, se muestran todos los productos.
function CategoryFilter({ id, categorias, seleccionadas, onToggle, onLimpiar, onCerrar }) {
  return (
    <aside id={id} className="filtros" aria-label="Filtros de productos">
      <div className="filtros__cabecera">
        <h2>Categorías</h2>
        {seleccionadas.length > 0 && (
          <button type="button" className="filtros__limpiar" onClick={onLimpiar}>
            Limpiar
          </button>
        )}
      </div>

      <ul className="filtros__lista">
        {categorias.map((c) => {
          const marcada = seleccionadas.includes(c.nombre)
          const vacia = c.cantidad === 0 && !marcada
          return (
            <li key={c.nombre}>
              <label className={'filtros__opcion' + (vacia ? ' filtros__opcion--vacia' : '')}>
                <input
                  type="checkbox"
                  checked={marcada}
                  disabled={vacia}
                  onChange={() => onToggle(c.nombre)}
                />
                <span>{c.nombre}</span>
                <span className="filtros__cantidad">{c.cantidad}</span>
              </label>
            </li>
          )
        })}
      </ul>

      {/* Solo se ve en celular: el panel flota sobre la página y hay que poder cerrarlo */}
      <button type="button" className="btn btn--amarillo filtros__listo" onClick={onCerrar}>
        Listo
      </button>
    </aside>
  )
}

export default CategoryFilter
