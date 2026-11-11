import { formatFecha, formatPrecio } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

// Muestra un pedido: fecha y hora, cada producto comprado y el total.
// En la vista del administrador (mostrarCliente) también aparece quién compró.
// numero: el número que se muestra. Cada usuario cuenta sus pedidos desde 1;
// el administrador ve el número general.
function PedidoCard({ pedido, numero = pedido.id, mostrarCliente = false }) {
  const unidades = pedido.items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <article className="pedido">
      <header className="pedido__cabecera">
        <div>
          <h2 className="pedido__titulo">Pedido #{numero}</h2>
          <p className="pedido__fecha">
            <time dateTime={pedido.fecha}>{formatFecha(pedido.fecha)}</time>
            {mostrarCliente && <> · Cliente: <strong>{pedido.usuarioNombre}</strong></>}
          </p>
        </div>
        <p className="pedido__total">{formatPrecio(pedido.total)}</p>
      </header>

      <ul className="pedido__items">
        {pedido.items.map((item) => (
          <li key={item.id} className="pedido__item">
            <ProductImage src={item.imagen} alt={item.nombre} className="pedido__img" />
            <div className="pedido__datos">
              <span className="pedido__nombre">{item.nombre}</span>
              <span className="pedido__detalle">{item.cantidad} × {formatPrecio(item.precio)}</span>
            </div>
            <strong className="pedido__subtotal">{formatPrecio(item.precio * item.cantidad)}</strong>
          </li>
        ))}
      </ul>

      <footer className="pedido__pie">
        {pedido.items.length} {pedido.items.length === 1 ? 'producto' : 'productos'} · {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
      </footer>
    </article>
  )
}

export default PedidoCard
