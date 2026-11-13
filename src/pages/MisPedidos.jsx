import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePedidos } from '../context/PedidosContext.jsx'
import { formatPrecio } from '../utils/format.js'
import PedidoCard from '../components/PedidoCard.jsx'

function MisPedidos() {
  const { usuario, esAdmin } = useAuth()
  const { pedidos, cancelarPedido, eliminarPedido } = usePedidos()

  // iniciar sesión para ver el historial
  if (!usuario) return <Navigate to="/login" replace />
  // El administrador no compra: su vista es la de todos los pedidos
  if (esAdmin) return <Navigate to="/admin/pedidos" replace />

  const mios = pedidos.filter((p) => p.usuarioId === usuario.id)
  const vigentes = mios.filter((p) => p.estado !== 'cancelado')
  const gastado = vigentes.reduce((acc, p) => acc + p.total, 0)
  const cancelados = mios.length - vigentes.length

  function handleCancelar(pedido, numero) {
    if (window.confirm(`¿Cancelar el pedido #${numero}? Los productos vuelven al stock.`)) {
      cancelarPedido(pedido.id, 'comprador')
    }
  }

  function handleEliminar(pedido, numero) {
    if (window.confirm(`¿Eliminar el pedido #${numero} del historial? Los pedidos siguientes se renumeran.`)) {
      eliminarPedido(pedido.id)
    }
  }

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
            {mios.length} {mios.length === 1 ? 'pedido' : 'pedidos'}
            {cancelados > 0 && <> ({cancelados} {cancelados === 1 ? 'cancelado' : 'cancelados'})</>}
            {' '}· Total gastado: <strong>{formatPrecio(gastado)}</strong>
          </p>
          <div className="pedidos__lista">
            {mios.map((p, i) => {
              const numero = mios.length - i
              return (
                <PedidoCard
                  key={p.id}
                  pedido={p}
                  numero={numero}
                  onCancelar={() => handleCancelar(p, numero)}
                  onEliminar={() => handleEliminar(p, numero)}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default MisPedidos
