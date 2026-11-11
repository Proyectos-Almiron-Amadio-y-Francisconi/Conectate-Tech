import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from './ProductsContext.jsx'
import { useAuth } from './AuthContext.jsx'

// Cada cliente tiene su propio carrito guardado: conectate_cart_<id del usuario>
const PREFIJO_STORAGE = 'conectate_cart_'
const CartContext = createContext(null)

// El carrito guarda solo { id, cantidad }. Los datos del producto salen del JSON.
function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'AGREGAR': {
      const existe = estado.find((i) => i.id === accion.id)
      // Nunca se puede superar el stock real del producto (accion.max)
      if ((existe?.cantidad ?? 0) >= accion.max) return estado
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
    case 'CARGAR':
      return accion.items
    case 'AJUSTAR_STOCK': {
      // Recorta lo que ya estaba guardado si supera el stock actual
      const ajustado = estado
        .map((i) => {
          const p = accion.productos.find((prod) => prod.id === i.id)
          return p ? { ...i, cantidad: Math.min(i.cantidad, p.stock) } : i
        })
        .filter((i) => i.cantidad > 0)
      const igual = ajustado.length === estado.length && ajustado.every((i, k) => i.cantidad === estado[k].cantidad)
      return igual ? estado : ajustado
    }
    default:
      return estado
  }
}

// Carrito guardado de un usuario (si no hay usuario, no hay carrito)
function cargarCarrito(usuarioId) {
  if (usuarioId == null) return []
  try {
    const guardado = JSON.parse(localStorage.getItem(PREFIJO_STORAGE + usuarioId))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { usuario, esAdmin } = useAuth()
  const navigate = useNavigate()
  // Solo los clientes con sesión iniciada tienen carrito (el administrador no compra)
  const puedeComprar = Boolean(usuario) && !esAdmin
  const duenioId = puedeComprar ? usuario.id : null

  const [items, dispatch] = useReducer(reducer, duenioId, cargarCarrito)
  const [duenioActual, setDuenioActual] = useState(duenioId)
  const [abierto, setAbierto] = useState(false)
  const { productos } = useProducts()

  // Si cambió el usuario (login, logout o cambio de cuenta), se carga SU carrito
  if (duenioActual !== duenioId) {
    setDuenioActual(duenioId)
    dispatch({ tipo: 'CARGAR', items: cargarCarrito(duenioId) })
    setAbierto(false)
  }

  const abrirCarrito = useCallback(() => setAbierto(true), [])
  const cerrarCarrito = useCallback(() => setAbierto(false), [])

  // Persistir en localStorage el carrito del usuario actual cada vez que cambia
  useEffect(() => {
    if (duenioId == null) return
    localStorage.setItem(PREFIJO_STORAGE + duenioId, JSON.stringify(items))
  }, [items, duenioId])

  // Si el carrito guardado (o el stock) quedó desfasado, lo corregimos
  useEffect(() => {
    dispatch({ tipo: 'AJUSTAR_STOCK', productos })
  }, [productos])

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
      puedeComprar,
      agregar: (id) => {
        // Sin sesión: se lo manda a iniciar sesión. Administrador: no puede comprar.
        if (!usuario) {
          navigate('/login')
          return
        }
        if (esAdmin) return
        const producto = productos.find((p) => p.id === id)
        if (producto) dispatch({ tipo: 'AGREGAR', id, max: producto.stock })
      },
      quitarUno: (id) => dispatch({ tipo: 'QUITAR_UNO', id }),
      eliminar: (id) => dispatch({ tipo: 'ELIMINAR', id }),
      vaciar: () => dispatch({ tipo: 'VACIAR' }),
      abierto,
      abrirCarrito,
      cerrarCarrito,
    }
  }, [items, productos, abierto, abrirCarrito, cerrarCarrito, usuario, esAdmin, puedeComprar, navigate])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook para usar el carrito desde cualquier componente
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
