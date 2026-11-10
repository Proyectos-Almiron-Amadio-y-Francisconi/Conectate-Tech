import { createContext, useContext, useState } from 'react'
import usuarios from '../data/usuarios.json'

const CLAVE_STORAGE = 'conectate_user'
const AuthContext = createContext(null)

function cargarUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(cargarUsuario)

  // Devuelve un mensaje de error si falla, o null si el login fue correcto
  function login(email, password) {
    const encontrado = usuarios.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    )
    if (!encontrado) return 'Email o contraseña incorrectos'

    // No guardamos la contraseña en la sesión
    const sesion = { id: encontrado.id, nombre: encontrado.nombre, email: encontrado.email, rol: encontrado.rol }
    setUsuario(sesion)
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesion))
    return null
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem(CLAVE_STORAGE)
  }

  const value = { usuario, esAdmin: usuario?.rol === 'admin', login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
