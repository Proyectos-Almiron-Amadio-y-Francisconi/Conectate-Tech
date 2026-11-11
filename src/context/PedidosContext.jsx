import { createContext, useContext, useEffect, useState } from 'react'

const CLAVE_STORAGE = 'conectate_pedidos'
const PedidosContext = createContext(null)

function cargarPedidos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || []
  } catch {
    return []
  }
}

export function PedidosProvider({ children }) {
  // Del más nuevo al más viejo
  const [pedidos, setPedidos] = useState(cargarPedidos)

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos))
  }, [pedidos])

  // Guarda un pedido con una "foto" de lo comprado (nombre, precio y cantidad al momento de comprar)
  function crearPedido(usuario, items) {
    const pedido = {
      id: pedidos.reduce((max, p) => Math.max(max, p.id), 0) + 1,
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      fecha: new Date().toISOString(),
      items: items.map((i) => ({
        id: i.id,
        nombre: i.nombre,
        imagen: i.imagen,
        precio: i.precio,
        cantidad: i.cantidad,
      })),
      total: items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }
    setPedidos([pedido, ...pedidos])
    return pedido
  }

  const value = { pedidos, crearPedido }
  return <PedidosContext.Provider value={value}>{children}</PedidosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePedidos() {
  const ctx = useContext(PedidosContext)
  if (!ctx) throw new Error('usePedidos debe usarse dentro de <PedidosProvider>')
  return ctx
}
