import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'
import NotFound from './NotFound.jsx'

function ProductDetail() {
  const { id } = useParams()
  const { agregar, quitarUno, getCantidad, abrirCarrito } = useCart()
  const { productos } = useProducts()
  const producto = productos.find((p) => p.id === Number(id))

  // Si el id de la URL no existe, mostramos la página 404
  if (!producto) return <NotFound />

  const enCarrito = getCantidad(producto.id)
  const alMaximo = enCarrito >= producto.stock

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
            {enCarrito === 0 ? (
              <button
                className="btn btn--amarillo"
                disabled={producto.stock === 0}
                onClick={() => agregar(producto.id)}
              >
                {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            ) : (
              <div className="detalle__contador">
                <button className="btn btn--rojo" onClick={() => quitarUno(producto.id)} aria-label="Quitar una unidad">−</button>
                <span>{enCarrito}</span>
                <button
                  className="btn btn--amarillo"
                  disabled={alMaximo}
                  onClick={() => agregar(producto.id)}
                  aria-label="Agregar una unidad"
                >+</button>
              </div>
            )}
            {enCarrito > 0 && (
              <button className="btn btn--negro" onClick={abrirCarrito}>
                Ver carrito ({enCarrito})
              </button>
            )}
          </div>
          {alMaximo && producto.stock > 0 && (
            <p className="detalle__aviso">Ya tenés en el carrito todas las unidades disponibles.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
