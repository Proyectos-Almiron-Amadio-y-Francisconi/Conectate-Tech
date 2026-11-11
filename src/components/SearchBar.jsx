import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

// Buscador del header. El texto vive en la URL (?q=...), así Home lo lee sin props.
function SearchBar() {
  const [params, setParams] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''

  function handleChange(e) {
    const valor = e.target.value
    if (pathname === '/') {
      setParams(valor ? { q: valor } : {}, { replace: true })
    } else {
      // Si estamos en otra página, buscar nos lleva al catálogo
      navigate(valor ? `/?q=${encodeURIComponent(valor)}` : '/')
    }
  }

  return (
    <form className="buscador" role="search" onSubmit={(e) => e.preventDefault()}>
      <svg className="buscador__icono" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        className="buscador__input"
        placeholder="Buscar productos"
        aria-label="Buscar productos"
        value={q}
        onChange={handleChange}
      />
    </form>
  )
}

export default SearchBar
