import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'

function Home() {
  const { productos } = useProducts()
  const [params] = useSearchParams()
  const busqueda = params.get('q') ?? ''

  const [seleccionadas, setSeleccionadas] = useState([])
  // En pantallas grandes el panel arranca abierto; en celulares, cerrado
  const [panelAbierto, setPanelAbierto] = useState(() => window.matchMedia('(min-width: 861px)').matches)

  // Primero se aplica la búsqueda (nombre o categoría)
  const coincidenBusqueda = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return productos.filter((p) => `${p.nombre} ${p.categoria}`.toLowerCase().includes(texto))
  }, [productos, busqueda])

  // Categorías únicas con la cantidad de productos que coinciden con la búsqueda
  const categorias = useMemo(() => {
    const nombres = [...new Set(productos.map((p) => p.categoria))]
    return nombres.map((nombre) => ({
      nombre,
      cantidad: coincidenBusqueda.filter((p) => p.categoria === nombre).length,
    }))
  }, [productos, coincidenBusqueda])

  const visibles =
    seleccionadas.length === 0
      ? coincidenBusqueda
      : coincidenBusqueda.filter((p) => seleccionadas.includes(p.categoria))

  function alternarCategoria(nombre) {
    setSeleccionadas((actual) =>
      actual.includes(nombre) ? actual.filter((c) => c !== nombre) : [...actual, nombre],
    )
  }

  return (
    <section className="container catalogo">
      <div className="catalogo__encabezado">
        <button
          type="button"
          className="catalogo__filtros-boton"
          onClick={() => setPanelAbierto(!panelAbierto)}
          aria-expanded={panelAbierto}
          aria-controls="panel-filtros"
        >
          Filtros
          {seleccionadas.length > 0 && <span className="catalogo__filtros-contador">{seleccionadas.length}</span>}
        </button>
        <p className="catalogo__resumen" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
          {busqueda.trim() && <> para “{busqueda.trim()}”</>}
        </p>
      </div>

      <div className={'catalogo__layout' + (panelAbierto ? '' : ' catalogo__layout--sin-panel')}>
        {panelAbierto && (
          <CategoryFilter
            id="panel-filtros"
            categorias={categorias}
            seleccionadas={seleccionadas}
            onToggle={alternarCategoria}
            onLimpiar={() => setSeleccionadas([])}
          />
        )}

        <div>
          {visibles.length === 0 ? (
            <p className="catalogo__vacio">No hay productos que coincidan. Probá con otra categoría o búsqueda.</p>
          ) : (
            <div className="catalogo__grilla">
              {visibles.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home
