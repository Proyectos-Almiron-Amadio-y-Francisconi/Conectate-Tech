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
  const hayBusqueda = Boolean(busqueda.trim())

  const { seleccionadas, panelAbierto, setPanelAbierto, alternarCategoria, limpiar } = useFiltros()

  // En celular el panel es un menú lateral: Escape lo cierra y bloquea el scroll de fondo
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
    <>
      {!hayBusqueda && (
        <>
          <section className="bienvenida" aria-labelledby="bienvenida-titulo">
            <div className="container bienvenida__contenido">
              <div className="bienvenida__texto">
                <p className="bienvenida__eyebrow">HARDWARE · GAMING · TECNOLOGÍA</p>
                <h1 id="bienvenida-titulo">
                  Conectate con la tecnología que <span>te mueve.</span>
                </h1>
                <p className="bienvenida__descripcion">
                  Componentes, periféricos y accesorios para armar, mejorar y disfrutar tu espacio digital.
                  Encontrá todo lo que necesitás para tu próximo setup.
                </p>
                <div className="bienvenida__acciones">
                  <a className="btn btn--amarillo bienvenida__boton" href="#productos">
                    Explorar productos
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="bienvenida__visual" aria-label="Productos destacados de tecnología">
                <div className="bienvenida__halo" />
                <div className="bienvenida__producto bienvenida__producto--principal">
                  <img src="/images/gpu-rtx-5070 (1).png" alt="Placa de video GeForce RTX 5070" />
                </div>
              
                <span className="bienvenida__sello">TU PRÓXIMO UPGRADE<br />EMPIEZA ACÁ</span>
              </div>
            </div>
          </section>

        
        </>
      )}

      <section className="container catalogo" id="productos" aria-labelledby="productos-titulo">
        <div className="catalogo__titulo">
          <div>
            <p className="catalogo__eyebrow">NUESTRO CATÁLOGO</p>
            <h2 id="productos-titulo">{hayBusqueda ? 'Resultados de búsqueda' : 'Encontrá tu próximo upgrade'}</h2>
          </div>
          <p className="catalogo__resumen" aria-live="polite">
            {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
            {hayBusqueda && <> para “{busqueda.trim()}”</>}
          </p>
        </div>

        <div className={'catalogo__layout' + (panelAbierto ? '' : ' catalogo__layout--sin-panel')}>
          {/* Fondo oscuro: solo se ve en celular, donde el panel es un menú lateral. */}
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
    </>
  )
}

export default Home

