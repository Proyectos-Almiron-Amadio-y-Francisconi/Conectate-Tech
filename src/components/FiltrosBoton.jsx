import { useFiltros } from '../context/FiltrosContext.jsx'

// Botón de filtros del header: solo el ícono (embudo). Abre y cierra el panel de categorías.
function FiltrosBoton() {
  const { panelAbierto, alternarPanel, seleccionadas } = useFiltros()

  return (
    <button
      type="button"
      className={'navbar__filtros' + (panelAbierto ? ' navbar__filtros--activo' : '')}
      onClick={alternarPanel}
      aria-label={seleccionadas.length > 0 ? `Filtros, ${seleccionadas.length} categorías marcadas` : 'Filtros'}
      aria-expanded={panelAbierto}
      aria-controls="panel-filtros"
      title="Filtros"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" />
      </svg>
      {seleccionadas.length > 0 && <span className="navbar__filtros-contador">{seleccionadas.length}</span>}
    </button>
  )
}

export default FiltrosBoton
