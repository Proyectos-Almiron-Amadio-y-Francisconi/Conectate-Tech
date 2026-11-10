import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Protege las rutas del panel: solo entra el administrador
function RutaAdmin({ children }) {
  const { usuario, esAdmin } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (!esAdmin) return <Navigate to="/" replace />
  return children
}

export default RutaAdmin
