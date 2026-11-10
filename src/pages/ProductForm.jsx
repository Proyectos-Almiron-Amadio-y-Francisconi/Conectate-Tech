import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import NotFound from './NotFound.jsx'

const CATEGORIAS_SUGERIDAS = [
  'CPUs', 'Mothers', 'Gráficos', 'RAM', 'Almacenamiento', 'Fuentes', 'Gabinetes',
  'Coolers', 'Monitores', 'Periféricos', 'Audio', 'Soportes', 'Protección',
]

const VACIO = { nombre: '', categoria: '', precio: '', stock: '', descripcion: '', imagen: '' }

// Un solo formulario para crear (/admin/nuevo) y editar (/admin/editar/:id)
function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productos, agregarProducto, editarProducto } = useProducts()

  const editando = id !== undefined
  const existente = editando ? productos.find((p) => p.id === Number(id)) : null

  const [datos, setDatos] = useState(existente ? { ...existente } : VACIO)
  const [errores, setErrores] = useState({})

  if (editando && !existente) return <NotFound />

  function handleChange(ev) {
    setDatos({ ...datos, [ev.target.name]: ev.target.value })
  }

  function validar() {
    const e = {}
    if (datos.nombre.trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres'
    if (!datos.categoria.trim()) e.categoria = 'Elegí o escribí una categoría'
    if (datos.precio === '' || Number(datos.precio) <= 0) e.precio = 'El precio debe ser un número mayor a 0'
    if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
      e.stock = 'El stock debe ser un número entero de 0 o más'
    }
    if (datos.descripcion.trim().length < 10) e.descripcion = 'La descripción debe tener al menos 10 caracteres'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    const limpio = {
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      descripcion: datos.descripcion.trim(),
      imagen: datos.imagen.trim(),
    }
    if (editando) editarProducto(existente.id, limpio)
    else agregarProducto(limpio)
    navigate('/admin')
  }

  return (
    <div className="container formulario-pagina">
      <form className="formulario" onSubmit={handleSubmit} noValidate>
        <h1>{editando ? 'Editar producto' : 'Nuevo producto'}</h1>

        <label className="formulario__campo">
          Nombre
          <input name="nombre" value={datos.nombre} onChange={handleChange} />
          {errores.nombre && <span className="formulario__error">{errores.nombre}</span>}
        </label>

        <label className="formulario__campo">
          Categoría
          <input name="categoria" list="categorias" value={datos.categoria} onChange={handleChange} />
          <datalist id="categorias">
            {CATEGORIAS_SUGERIDAS.map((c) => <option key={c} value={c} />)}
          </datalist>
          {errores.categoria && <span className="formulario__error">{errores.categoria}</span>}
        </label>

        <div className="formulario__fila">
          <label className="formulario__campo">
            Precio ($)
            <input name="precio" type="number" min="0" value={datos.precio} onChange={handleChange} />
            {errores.precio && <span className="formulario__error">{errores.precio}</span>}
          </label>
          <label className="formulario__campo">
            Stock
            <input name="stock" type="number" min="0" value={datos.stock} onChange={handleChange} />
            {errores.stock && <span className="formulario__error">{errores.stock}</span>}
          </label>
        </div>

        <label className="formulario__campo">
          Descripción
          <textarea name="descripcion" rows="3" value={datos.descripcion} onChange={handleChange} />
          {errores.descripcion && <span className="formulario__error">{errores.descripcion}</span>}
        </label>

        <label className="formulario__campo">
          Imagen (opcional)
          <input name="imagen" placeholder="/images/cpu.jpg o un link https://..." value={datos.imagen} onChange={handleChange} />
          <span className="formulario__nota">Si la dejás vacía se muestra una imagen genérica.</span>
        </label>

        <div className="formulario__botones">
          <Link to="/admin" className="btn btn--contorno">Cancelar</Link>
          <button type="submit" className="btn btn--amarillo">{editando ? 'Guardar cambios' : 'Agregar producto'}</button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
