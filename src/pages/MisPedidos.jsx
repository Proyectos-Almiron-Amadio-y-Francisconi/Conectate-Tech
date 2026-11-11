import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePedidos } from '../context/PedidosContext.jsx'
import { formatPrecio } from '../utils/format.js'
import PedidoCard from '../components/PedidoCard.jsx'

function MisPedidos() {
  const { usuario, esAdmin } = useAuth()
  const { pedidos } = usePedidos()

  // Hay que haber iniciado sesión para ver el historial
  if (!usuario) return <Navigate to="/login" replace />
  // El administrador no compra: su vista es la de todos los pedidos
  if (esAdmin) return <Navigate to="/admin/pedidos" replace />

  const mios = pedidos.filter((p) => p.usuarioId === usuario.id)
  const gastado = mios.reduce((acc, p) => acc + p.total, 0)

  return (
    <div className="container pedidos">
      <h1>Mis pedidos</h1>

      {mios.length === 0 ? (
        <div className="pedidos__vacio">
          <p>Todavía no hiciste ninguna compra.</p>
          <Link to="/" className="btn btn--amarillo">Ir al catálogo</Link>
        </div>
      ) : (
        <>
          <p className="pedidos__resumen">
            {mios.length} {mios.length === 1 ? 'pedido' : 'pedidos'} · Total gastado: <strong>{formatPrecio(gastado)}</strong>
          </p>
          <div className="pedidos__lista">
            {mios.map((p, i) => (
              <PedidoCard key={p.id} pedido={p} numero={mios.length - i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MisPedidos
