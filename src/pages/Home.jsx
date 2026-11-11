import { useMemo, useState } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'

function Home() {
  const { productos } = useProducts()
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  // Categorías únicas, sacadas del JSON
  const categorias = useMemo(() => [...new Set(productos.map((p) => p.categoria))], [productos])

  const visibles = productos.filter(
    (p) =>
      (categoria === 'Todas' || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <>
      <section className="container catalogo">
        <div className="catalogo__barra">
          <CategoryFilter categorias={categorias} activa={categoria} onChange={setCategoria} />
          <input
            type="search"
            className="catalogo__buscador"
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar producto"
          />
        </div>

        {visibles.length === 0 ? (
          <p className="catalogo__vacio">No hay productos que coincidan. Probá con otra categoría o búsqueda.</p>
        ) : (
          <div className="catalogo__grilla">
            {visibles.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default Home
