import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrecio } from '../utils/format.js'
import SearchBar from './SearchBar.jsx'

function Navbar() {
  const { cantidadTotal, total, abrirCarrito } = useCart()
  const { usuario, esAdmin, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  // Con el menú abierto: Escape lo cierra y se bloquea el scroll de la página
  useEffect(() => {
    if (!menuAbierto) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', onKeyDown)

    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowPrevio
    }
  }, [menuAbierto])

  function handleLogout() {
    logout()
    cerrarMenu()
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Conectate <b className="navbar__brand-tech">Tech</b>
        </Link>

        <SearchBar />

        <div className="navbar__derecha">
          {/* El administrador no compra: no tiene carrito */}
          {!esAdmin && (
            <button type="button" className="navbar__cart" onClick={abrirCarrito} aria-label={`Abrir carrito, ${cantidadTotal} productos, total ${formatPrecio(total)}`}>
              <span className="navbar__icono">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cantidadTotal > 0 && <span className="navbar__badge">{cantidadTotal}</span>}
              </span>
              {cantidadTotal > 0 && <span className="navbar__total">{formatPrecio(total)}</span>}
            </button>
          )}

          <button
            type="button"
            className="navbar__hamburguesa"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="menu">
          <div className="menu__fondo" onClick={cerrarMenu} />

          <nav id="menu-principal" className="menu__panel" aria-label="Principal">
            <div className="menu__cabecera">
              <span className="menu__titulo">Menú</span>
              <button type="button" className="menu__cerrar" onClick={cerrarMenu} aria-label="Cerrar menú">×</button>
            </div>

            <ul className="menu__lista">
              <li><NavLink to="/" end onClick={cerrarMenu}>Catálogo</NavLink></li>
              {usuario && !esAdmin && <li><NavLink to="/mis-pedidos" onClick={cerrarMenu}>Mis pedidos</NavLink></li>}
              {esAdmin && <li><NavLink to="/admin" end onClick={cerrarMenu}>Modo administrador</NavLink></li>}
              {esAdmin && <li><NavLink to="/admin/pedidos" onClick={cerrarMenu}>Pedidos</NavLink></li>}
            </ul>

            <div className="menu__pie">
              {usuario ? (
                <>
                  <p className="menu__usuario">
                    {usuario.nombre}
                    <small>Usuario: {esAdmin ? 'Administrador' : 'Cliente'}</small>
                  </p>
                  <button type="button" className="menu__salir" onClick={handleLogout}>Cerrar sesión</button>
                </>
              ) : (
                <NavLink to="/login" className="menu__entrar" onClick={cerrarMenu}>Iniciar sesión</NavLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
