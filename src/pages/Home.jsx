import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import { useFiltros } from '../context/FiltrosContext.jsx'

function Home() {
  const { productos } = useProducts()
  const [params] = useSearchParams()
  const busqueda = params.get('q') ?? ''

  const { seleccionadas, panelAbierto, setPanelAbierto, alternarCategoria, limpiar } = useFiltros()

  // En celular el panel es un menú lateral (izquierda): con él abierto, Escape lo cierra
  // y no se desplaza la página de atrás
  useEffect(() => {
    if (!panelAbierto || !window.matchMedia('(max-width: 860px)').matches) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setPanelAbierto(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowPrevio
    }
  }, [panelAbierto, setPanelAbierto])

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

  return (
    <section className="container catalogo">
      <div className="catalogo__encabezado">
        <p className="catalogo__resumen" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
          {busqueda.trim() && <> para “{busqueda.trim()}”</>}
        </p>
      </div>

      <div className={'catalogo__layout' + (panelAbierto ? '' : ' catalogo__layout--sin-panel')}>
        {/* Fondo oscuro: solo se ve en celular, donde el panel es un menú lateral */}
        {panelAbierto && <div className="catalogo__filtros-fondo" onClick={() => setPanelAbierto(false)} />}
        {panelAbierto && (
          <CategoryFilter
            id="panel-filtros"
            categorias={categorias}
            seleccionadas={seleccionadas}
            onToggle={alternarCategoria}
            onLimpiar={limpiar}
            onCerrar={() => setPanelAbierto(false)}
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
