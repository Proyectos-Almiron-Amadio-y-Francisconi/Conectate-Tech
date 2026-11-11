import { createContext, useContext, useEffect, useState } from 'react'
import hardwareInicial from '../data/hardware.json'

// Subir este número cada vez que se edita hardware.json: así todos los navegadores
// descartan el catálogo viejo guardado y cargan el actualizado.
const VERSION_CATALOGO = 6
const CLAVE_STORAGE = `conectate_productos_v${VERSION_CATALOGO}`
const ProductsContext = createContext(null)

// Los productos se cargan desde localStorage; si no hay nada, se usa hardware.json
function cargarProductos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || hardwareInicial
  } catch {
    return hardwareInicial
  }
}

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState(cargarProductos)

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos))
  }, [productos])

  function agregarProducto(datos) {
    const nuevoId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
    setProductos([...productos, { ...datos, id: nuevoId }])
  }

  function editarProducto(id, datos) {
    setProductos(productos.map((p) => (p.id === id ? { ...p, ...datos } : p)))
  }

  function eliminarProducto(id) {
    setProductos(productos.filter((p) => p.id !== id))
  }

  // Al confirmar una compra: resta del stock lo que se vendió
  function descontarStock(items) {
    setProductos((actuales) =>
      actuales.map((p) => {
        const vendido = items.find((i) => i.id === p.id)
        return vendido ? { ...p, stock: Math.max(0, p.stock - vendido.cantidad) } : p
      }),
    )
  }

  function restaurarCatalogo() {
    setProductos(hardwareInicial)
  }

  const value = { productos, agregarProducto, editarProducto, eliminarProducto, descontarStock, restaurarCatalogo }
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts debe usarse dentro de <ProductsProvider>')
  return ctx
}
