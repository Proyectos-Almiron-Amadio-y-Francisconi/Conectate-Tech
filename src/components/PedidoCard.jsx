import { formatFecha, formatPrecio } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

// Quién ve el pedido y quién lo canceló determinan el aviso que se muestra
function avisoCancelacion(pedido, vistaAdmin) {
  const cancelo = pedido.canceladoPor
  if (vistaAdmin) {
    return cancelo === 'comprador' ? 'El comprador canceló este pedido.' : 'Cancelaste este pedido.'
  }
  return cancelo === 'vendedor' ? 'El vendedor canceló este pedido.' : 'Cancelaste este pedido.'
}

// Muestra un pedido: fecha y hora, cada producto comprado y el total.
// numero: el número que se muestra (cada usuario cuenta sus pedidos desde 1;
// el administrador ve el número general).
// mostrarCliente: vista del administrador (aparece quién compró).
// onCancelar / onEliminar: acciones disponibles según el estado del pedido.
function PedidoCard({ pedido, numero = pedido.id, mostrarCliente = false, onCancelar, onEliminar }) {
  const unidades = pedido.items.reduce((acc, i) => acc + i.cantidad, 0)
  const cancelado = pedido.estado === 'cancelado'

  return (
    <article className={'pedido' + (cancelado ? ' pedido--cancelado' : '')}>
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

      {cancelado && (
        <p className="pedido__aviso" role="status">
          <strong>Pedido cancelado.</strong> {avisoCancelacion(pedido, mostrarCliente)}
          {pedido.fechaCancelacion && <> ({formatFecha(pedido.fechaCancelacion)})</>}
          {' '}El stock volvió al catálogo.
        </p>
      )}

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
        <span>
          {pedido.items.length} {pedido.items.length === 1 ? 'producto' : 'productos'} · {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
        </span>
        {!cancelado && onCancelar && (
          <button type="button" className="pedido__accion" onClick={onCancelar}>Cancelar pedido</button>
        )}
        {cancelado && onEliminar && (
          <button type="button" className="pedido__accion" onClick={onEliminar}>Eliminar del historial</button>
        )}
      </footer>
    </article>
  )
}

export default PedidoCard
