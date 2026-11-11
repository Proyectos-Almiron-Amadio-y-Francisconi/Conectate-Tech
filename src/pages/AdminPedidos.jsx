import { useState } from 'react'
import { Link } from 'react-router-dom'
import usuarios from '../data/usuarios.json'
import { usePedidos } from '../context/PedidosContext.jsx'
import { formatPrecio } from '../utils/format.js'
import PedidoCard from '../components/PedidoCard.jsx'

// Vista del administrador: los pedidos de todos los usuarios
function AdminPedidos() {
  const { pedidos } = usePedidos()
  const [clienteId, setClienteId] = useState('todos')

  const visibles = clienteId === 'todos' ? pedidos : pedidos.filter((p) => p.usuarioId === Number(clienteId))
  const facturado = visibles.reduce((acc, p) => acc + p.total, 0)

  return (
    <div className="container pedidos">
      <div className="pedidos__encabezado">
        <h1>Pedidos</h1>
        <Link to="/admin" className="btn btn--contorno">← Volver al panel</Link>
      </div>

      <div className="pedidos__filtro">
        <label>
          Cliente
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="todos">Todos</option>
            {usuarios.filter((u) => u.rol !== 'admin').map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </label>
        <p className="pedidos__resumen">
          {visibles.length} {visibles.length === 1 ? 'pedido' : 'pedidos'} · Total: <strong>{formatPrecio(facturado)}</strong>
        </p>
      </div>

      {visibles.length === 0 ? (
        <p className="pedidos__vacio">No hay pedidos para mostrar.</p>
      ) : (
        <div className="pedidos__lista">
          {visibles.map((p) => (
            <PedidoCard key={p.id} pedido={p} mostrarCliente />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPedidos
