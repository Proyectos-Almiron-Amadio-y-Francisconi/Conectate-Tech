import { useState } from 'react'

// Muestra la imagen del producto. Si el archivo todavía no existe, usa un placeholder.
function ProductImage({ src, alt, className }) {
  const [fallo, setFallo] = useState(false)
  return (
    <img
      className={className}
      src={fallo ? '/images/placeholder.svg' : src}
      alt={alt}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}

export default ProductImage
