import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'
import NotFound from './NotFound.jsx'

function ProductDetail() {
  const { id } = useParams()
  const { agregar, getCantidad } = useCart()
  const { productos } = useProducts()
  const producto = productos.find((p) => p.id === Number(id))

  // Si el id de la URL no existe, mostramos la página 404
  if (!producto) return <NotFound />

  const enCarrito = getCantidad(producto.id)

  return (
    <div className="container detalle">
      <Link to="/" className="detalle__volver">← Volver al catálogo</Link>

      <div className="detalle__grid">
        <div className="detalle__imagen-caja">
          <ProductImage src={producto.imagen} alt={producto.nombre} className="detalle__imagen" />
        </div>

        <div className="detalle__info">
          <span className="detalle__categoria">{producto.categoria}</span>
          <h1 className="detalle__titulo">{producto.nombre}</h1>
          <p className="detalle__desc">{producto.descripcion}</p>
          <p className="detalle__precio">{formatPrecio(producto.precio)}</p>
          <p className="detalle__stock">
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
          </p>

          <div className="detalle__acciones">
            <button
              className="btn btn--amarillo"
              disabled={producto.stock === 0}
              onClick={() => agregar(producto.id)}
            >
              Agregar al carrito
            </button>
            {enCarrito > 0 && (
              <Link to="/carrito" className="btn btn--negro">
                Ver carrito ({enCarrito})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
