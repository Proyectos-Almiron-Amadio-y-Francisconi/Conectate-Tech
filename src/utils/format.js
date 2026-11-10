// Formatea un número como precio en pesos argentinos: 562000 -> "$ 562.000"
export function formatPrecio(valor) {
  return '$ ' + valor.toLocaleString('es-AR')
}
