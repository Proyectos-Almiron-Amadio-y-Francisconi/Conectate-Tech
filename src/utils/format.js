// Formatea un número como precio en pesos argentinos: 562000 -> "$ 562.000"
export function formatPrecio(valor) {
  return '$ ' + valor.toLocaleString('es-AR')
}

// Formatea una fecha ISO como "11/11/2026, 09:59 hs" (24 horas)
export function formatFecha(iso) {
  const fecha = new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  return fecha + ' hs'
}
