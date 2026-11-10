import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

// Panel lateral del carrito. Solo se monta mientras está abierto,
// así el estado interno (ej. "compra realizada") se reinicia al cerrarlo.
function PanelCarrito() {
  const { detalle, total, agregar, quitarUno, eliminar, vaciar, cerrarCarrito } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [compraHecha, setCompraHecha] = useState(null)
  const botonCerrar = useRef(null)

  useEffect(() => {
    botonCerrar.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') cerrarCarrito()
    }
    document.addEventListener('keydown', onKeyDown)

    // Evita que la página de atrás se desplace mientras el carrito está abierto
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowPrevio
    }
  }, [cerrarCarrito])

  function finalizarCompra() {
    // Para comprar hay que haber iniciado sesión
    if (!usuario) {
      cerrarCarrito()
      navigate('/login')
      return
    }
    setCompraHecha(total) // guardamos el total antes de vaciar
    vaciar()
  }

  return (
    <div className="drawer">
      <div className="drawer__fondo" onClick={cerrarCarrito} />

      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-titulo">
        <header className="drawer__cabecera">
          <h2 id="drawer-titulo" className="drawer__titulo">Tu carrito</h2>
          <button ref={botonCerrar} className="drawer__cerrar" onClick={cerrarCarrito} aria-label="Cerrar carrito">
            ×
          </button>
        </header>

        {compraHecha !== null ? (
          <div className="drawer__mensaje">
            <h3>¡Compra realizada!</h3>
            <p>Total procesado: {formatPrecio(compraHecha)}. Gracias por elegir Conectate Tech.</p>
            <button className="btn btn--amarillo" onClick={cerrarCarrito}>Seguir comprando</button>
          </div>
        ) : detalle.length === 0 ? (
          <div className="drawer__mensaje">
            <h3>Tu carrito está vacío</h3>
            <p>Elegí productos del catálogo para empezar tu compra.</p>
            <button className="btn btn--amarillo" onClick={cerrarCarrito}>Seguir viendo productos</button>
          </div>
        ) : (
          <>
            <ul className="drawer__lista">
              {detalle.map((item) => (
                <li key={item.id} className="drawer__item">
                  <ProductImage src={item.imagen} alt={item.nombre} className="drawer__img" />

                  <div className="drawer__datos">
                    <Link to={`/producto/${item.id}`} className="drawer__nombre" onClick={cerrarCarrito}>
                      {item.nombre}
                    </Link>
                    <span className="drawer__unitario">{formatPrecio(item.precio)} c/u</span>

                    <div className="drawer__fila">
                      <div className="drawer__cantidad">
                        <button className="btn btn--rojo" onClick={() => quitarUno(item.id)} aria-label="Quitar una unidad">−</button>
                        <span>{item.cantidad}</span>
                        <button className="btn btn--amarillo" onClick={() => agregar(item.id)} aria-label="Agregar una unidad">+</button>
                      </div>
                      <strong className="drawer__subtotal">{formatPrecio(item.precio * item.cantidad)}</strong>
                    </div>
                  </div>

                  <button className="drawer__eliminar" onClick={() => eliminar(item.id)}>Quitar</button>
                </li>
              ))}
            </ul>

            <footer className="drawer__pie">
              <p className="drawer__total">Total: <strong>{formatPrecio(total)}</strong></p>
              <div className="drawer__botones">
                <button className="btn btn--contorno" onClick={vaciar}>Vaciar</button>
                <button className="btn btn--amarillo" onClick={finalizarCompra}>Finalizar compra</button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

function CartDrawer() {
  const { abierto } = useCart()
  if (!abierto) return null
  return <PanelCarrito />
}

export default CartDrawer
