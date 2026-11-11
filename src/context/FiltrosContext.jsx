import { createContext, useContext, useState } from 'react'

const FiltrosContext = createContext(null)

// Estado del filtro de categorías. Vive acá (y no en Home) porque el botón de filtros
// está en el header y el panel está en el catálogo: los dos tienen que compartirlo.
export function FiltrosProvider({ children }) {
  const [seleccionadas, setSeleccionadas] = useState([])
  // En pantallas grandes el panel arranca abierto; en celulares, cerrado
  const [panelAbierto, setPanelAbierto] = useState(() => window.matchMedia('(min-width: 861px)').matches)

  function alternarPanel() {
    setPanelAbierto((abierto) => !abierto)
  }

  function alternarCategoria(nombre) {
    setSeleccionadas((actual) =>
      actual.includes(nombre) ? actual.filter((c) => c !== nombre) : [...actual, nombre],
    )
  }

  function limpiar() {
    setSeleccionadas([])
  }

  const value = { seleccionadas, panelAbierto, setPanelAbierto, alternarPanel, alternarCategoria, limpiar }
  return <FiltrosContext.Provider value={value}>{children}</FiltrosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFiltros() {
  const ctx = useContext(FiltrosContext)
  if (!ctx) throw new Error('useFiltros debe usarse dentro de <FiltrosProvider>')
  return ctx
}
