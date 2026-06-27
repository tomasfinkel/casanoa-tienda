import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ producto }) {
  const { agregarItem } = useCart()
  const [imagenRota, setImagenRota] = useState(false)

  return (
    <div className="card-producto">
      {producto.imagen && !imagenRota && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
        />
      )}
      <p className="categoria">{producto.categoria}</p>
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}</p>
      <button onClick={() => agregarItem(producto.id)}>Agregar al carrito</button>
    </div>
  )
}
