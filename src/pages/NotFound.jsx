import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>Página no encontrada</h1>
      <p style={{ margin: '0.8rem 0 1.5rem' }}>La dirección que buscás no existe o el producto fue eliminado.</p>
      <Link to="/" className="btn btn--amarillo">Volver al catálogo</Link>
    </div>
  )
}

export default NotFound
