import { useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import codigosNovedades from '../data/novedades.json'

function TarjetaNovedad({ producto }) {
  const { agregarItem } = useCart()
  const [imagenRota, setImagenRota] = useState(false)

  return (
    <div className="tarjeta-novedad">
      {producto.imagen && !imagenRota && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
        />
      )}
      <div className="tarjeta-novedad-nombre">{producto.nombre}</div>
      <div className="tarjeta-novedad-precio">${producto.precio}</div>
      <button onClick={() => agregarItem(producto.id)}>Agregar</button>
    </div>
  )
}

export default function Novedades() {
  const { productos } = useCatalogo()

  const items = codigosNovedades
    .map((cod) => productos.find((p) => p.id === cod))
    .filter(Boolean)

  if (items.length === 0) return null

  return (
    <section className="seccion-novedades">
      <h2>Novedades</h2>
      <div className="fila-novedades">
        {items.map((p) => (
          <TarjetaNovedad key={p.id} producto={p} />
        ))}
      </div>
    </section>
  )
}
