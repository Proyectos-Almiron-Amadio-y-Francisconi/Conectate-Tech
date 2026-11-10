import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

function ProductCard({ producto }) {
  const { getCantidad, agregar, quitarUno } = useCart()
  const cantidad = getCantidad(producto.id)

  return (
    <article className="card">
      <Link to={`/producto/${producto.id}`} className="card__imagen-link">
        <ProductImage src={producto.imagen} alt={producto.nombre} className="card__imagen" />
      </Link>

      <div className="card__cuerpo">
        <span className="card__categoria">{producto.categoria}</span>
        <h3 className="card__titulo">
          <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
        </h3>
        <p className="card__precio">{formatPrecio(producto.precio)}</p>

        {cantidad === 0 ? (
          <button className="btn btn--amarillo card__accion" onClick={() => agregar(producto.id)}>
            Agregar al carrito
          </button>
        ) : (
          <div className="card__contador">
            <button className="btn btn--rojo" onClick={() => quitarUno(producto.id)} aria-label="Quitar una unidad">−</button>
            <span>{cantidad}</span>
            <button className="btn btn--amarillo" onClick={() => agregar(producto.id)} aria-label="Agregar una unidad">+</button>
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
