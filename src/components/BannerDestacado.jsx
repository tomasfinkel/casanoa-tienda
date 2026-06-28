import { useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import destacado from '../data/destacado.json'

export default function BannerDestacado() {
  const { productos } = useCatalogo()
  const { agregarItem } = useCart()
  const [imagenRota, setImagenRota] = useState(false)

  if (!destacado.activo) return null

  const producto = productos.find((p) => p.id === destacado.codigo)
  if (!producto) return null

  return (
    <section className="banner-destacado">
      {producto.imagen && !imagenRota && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
        />
      )}
      <div className="banner-destacado-info">
        <span className="banner-destacado-etiqueta">{destacado.etiqueta}</span>
        <h3>{producto.nombre}</h3>
        <p className="banner-destacado-precio">${producto.precio}</p>
        <button onClick={() => agregarItem(producto.id)}>Agregar al carrito</button>
      </div>
    </section>
  )
}
