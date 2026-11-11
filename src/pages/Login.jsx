import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import usuarios from '../data/usuarios.json'

function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})

  // Si ya hay sesión iniciada, no tiene sentido mostrar el login
  if (usuario) return <Navigate to="/" replace />

  function validar() {
    const e = {}
    if (!email.trim()) e.email = 'Ingresá tu email'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'El email no tiene un formato válido'
    if (!password) e.password = 'Ingresá tu contraseña'
    else if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    const errorLogin = login(email, password)
    if (errorLogin) setErrores({ general: errorLogin })
    else navigate('/')
  }

  return (
    <div className="container formulario-pagina">
      <form className="formulario formulario--angosto" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>

        {errores.general && <p className="formulario__error-general" role="alert">{errores.general}</p>}

        <label className="formulario__campo">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errores.email && <span className="formulario__error">{errores.email}</span>}
        </label>

        <label className="formulario__campo">
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errores.password && <span className="formulario__error">{errores.password}</span>}
        </label>

        <button type="submit" className="btn btn--amarillo">Entrar</button>

        <div className="formulario__ayuda">
          <p><strong>Usuarios de prueba</strong></p>
          {usuarios.map((u) => (
            <p key={u.id}>{u.nombre}: {u.email} / {u.password}</p>
          ))}
        </div>
      </form>
    </div>
  )
}

export default Login
