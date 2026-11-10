import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'

function Cart() {
  const { detalle, total, agregar, quitarUno, eliminar, vaciar } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [compraHecha, setCompraHecha] = useState(null)

  function finalizarCompra() {
    // Para comprar hay que haber iniciado sesión
    if (!usuario) {
      navigate('/login')
      return
    }
    setCompraHecha(total) // guardamos el total antes de vaciar
    vaciar()
  }

  if (compraHecha !== null) {
    return (
      <div className="container carrito carrito--vacio">
        <h1>¡Compra realizada!</h1>
        <p>Total procesado: {formatPrecio(compraHecha)}. Gracias por elegir Conectate Tech.</p>
        <Link to="/" className="btn btn--amarillo" onClick={() => setCompraHecha(null)}>Seguir comprando</Link>
      </div>
    )
  }

  if (detalle.length === 0) {
    return (
      <div className="container carrito carrito--vacio">
        <h1>Tu carrito está vacío</h1>
        <p>Elegí productos del catálogo para empezar tu compra.</p>
        <Link to="/" className="btn btn--amarillo">Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className="container carrito">
      <h1>Tu carrito</h1>

      <ul className="carrito__lista">
        {detalle.map((item) => (
          <li key={item.id} className="carrito__item">
            <ProductImage src={item.imagen} alt={item.nombre} className="carrito__img" />
            <div className="carrito__datos">
              <Link to={`/producto/${item.id}`} className="carrito__nombre">{item.nombre}</Link>
              <span className="carrito__unitario">{formatPrecio(item.precio)} c/u</span>
            </div>
            <div className="carrito__cantidad">
              <button className="btn btn--rojo" onClick={() => quitarUno(item.id)} aria-label="Quitar una unidad">−</button>
              <span>{item.cantidad}</span>
              <button className="btn btn--amarillo" onClick={() => agregar(item.id)} aria-label="Agregar una unidad">+</button>
            </div>
            <strong className="carrito__subtotal">{formatPrecio(item.precio * item.cantidad)}</strong>
            <button className="carrito__eliminar" onClick={() => eliminar(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div className="carrito__resumen">
        <p className="carrito__total">Total: <strong>{formatPrecio(total)}</strong></p>
        <div className="carrito__botones">
          <button className="btn btn--contorno" onClick={vaciar}>Vaciar carrito</button>
          <button className="btn btn--amarillo" onClick={finalizarCompra}>Finalizar compra</button>
        </div>
      </div>
    </div>
  )
}

export default Cart
