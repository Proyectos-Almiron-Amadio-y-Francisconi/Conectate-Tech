import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatPrecio } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'

function Admin() {
  const { productos, eliminarProducto, restaurarCatalogo } = useProducts()

  function handleEliminar(producto) {
    if (window.confirm(`¿Eliminar "${producto.nombre}" del catálogo?`)) {
      eliminarProducto(producto.id)
    }
  }

  function handleRestaurar() {
    if (window.confirm('Esto borra tus cambios y vuelve al catálogo original. ¿Seguro?')) {
      restaurarCatalogo()
    }
  }

  return (
    <div className="container admin">
      <div className="admin__encabezado">
        <h1>Panel de administración</h1>
        <div className="admin__acciones">
          <button className="btn btn--contorno" onClick={handleRestaurar}>Restaurar catálogo</button>
          <Link to="/admin/nuevo" className="btn btn--amarillo">+ Nuevo producto</Link>
        </div>
      </div>

      <p className="admin__cantidad">{productos.length} productos en el catálogo</p>

      <div className="admin__tabla-caja">
        <table className="admin__tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td><ProductImage src={p.imagen} alt={p.nombre} className="admin__img" /></td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatPrecio(p.precio)}</td>
                <td>{p.stock}</td>
                <td className="admin__botones">
                  <Link to={`/admin/editar/${p.id}`} className="btn btn--negro">Editar</Link>
                  <button className="btn btn--rojo" onClick={() => handleEliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin
