import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

function ProductCard({ producto }) {
  const { getCantidad, agregar, quitarUno } = useCart()
  const cantidad = getCantidad(producto.id)
  const alMaximo = cantidad >= producto.stock

  return (
    <article className="card">
      <div className="card__imagen-caja">
        <ProductImage src={producto.imagen} alt={producto.nombre} className="card__imagen" />
      </div>

      <div className="card__cuerpo">
        <span className="card__categoria">{producto.categoria}</span>
        <h3 className="card__titulo">{producto.nombre}</h3>
        <p className="card__precio">{formatPrecio(producto.precio)}</p>

        <div className="card__acciones">
          {cantidad === 0 ? (
            <button
              className="btn btn--amarillo"
              disabled={producto.stock === 0}
              onClick={() => agregar(producto.id)}
            >
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          ) : (
            <div className="card__contador">
              <button className="btn btn--rojo" onClick={() => quitarUno(producto.id)} aria-label="Quitar una unidad">−</button>
              <span>{cantidad}</span>
              <button
                className="btn btn--amarillo"
                disabled={alMaximo}
                title={alMaximo ? 'Alcanzaste el stock disponible' : undefined}
                onClick={() => agregar(producto.id)}
                aria-label="Agregar una unidad"
              >+</button>
            </div>
          )}

          <Link to={`/producto/${producto.id}`} className="btn btn--contorno">
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
