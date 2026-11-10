import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrecio } from '../utils/format.js'

function Navbar() {
  const { cantidadTotal, total, abrirCarrito } = useCart()
  const { usuario, esAdmin, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Conectate<span className="navbar__brand-tech"> Tech</span>
        </Link>

        <nav className="navbar__links" aria-label="Principal">
          <NavLink to="/" end>Catálogo</NavLink>
          {esAdmin && <NavLink to="/admin">Admin</NavLink>}
          <button type="button" className="navbar__cart" onClick={abrirCarrito}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Carrito</span>
            {cantidadTotal > 0 && <span className="navbar__badge">{cantidadTotal}</span>}
            {cantidadTotal > 0 && <span className="navbar__total">{formatPrecio(total)}</span>}
          </button>
          {usuario ? (
            <span className="navbar__usuario">
              {usuario.nombre}
              <button className="navbar__salir" onClick={logout}>Cerrar sesión</button>
            </span>
          ) : (
            <NavLink to="/login">Iniciar sesión</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
