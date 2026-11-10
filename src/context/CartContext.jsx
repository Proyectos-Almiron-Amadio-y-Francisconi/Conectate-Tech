import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useProducts } from './ProductsContext.jsx'

const CLAVE_STORAGE = 'conectate_cart'
const CartContext = createContext(null)

// El carrito guarda solo { id, cantidad }. Los datos del producto salen del JSON.
function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'AGREGAR': {
      const existe = estado.find((i) => i.id === accion.id)
      if (existe) {
        return estado.map((i) => (i.id === accion.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...estado, { id: accion.id, cantidad: 1 }]
    }
    case 'QUITAR_UNO':
      return estado
        .map((i) => (i.id === accion.id ? { ...i, cantidad: i.cantidad - 1 } : i))
        .filter((i) => i.cantidad > 0)
    case 'ELIMINAR':
      return estado.filter((i) => i.id !== accion.id)
    case 'VACIAR':
      return []
    default:
      return estado
  }
}

function cargarInicial() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], cargarInicial)
  const { productos } = useProducts()

  // Persistir en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    // Une cada item del carrito con los datos completos del producto
    const detalle = items
      .map((i) => ({ ...productos.find((p) => p.id === i.id), cantidad: i.cantidad }))
      .filter((i) => i.nombre)

    return {
      detalle,
      cantidadTotal: detalle.reduce((acc, i) => acc + i.cantidad, 0),
      total: detalle.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      getCantidad: (id) => items.find((i) => i.id === id)?.cantidad ?? 0,
      agregar: (id) => dispatch({ tipo: 'AGREGAR', id }),
      quitarUno: (id) => dispatch({ tipo: 'QUITAR_UNO', id }),
      eliminar: (id) => dispatch({ tipo: 'ELIMINAR', id }),
      vaciar: () => dispatch({ tipo: 'VACIAR' }),
    }
  }, [items, productos])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook para usar el carrito desde cualquier componente
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
