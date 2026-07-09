import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import sabores from '../data/sabores.json'

export default function ProductCard({ producto }) {
  const { agregarItem } = useCart()
  const [imagenSrc, setImagenSrc] = useState(`/productos/${producto.id}.jpg`)
  const [imagenRota, setImagenRota] = useState(false)
  const [saborElegido, setSaborElegido] = useState('')
  const [error, setError] = useState(false)

  const listaSabores = sabores[producto.id] || null

  function handleImagenError() {
    // Si falla .jpg, intentar .png
    if (imagenSrc.endsWith('.jpg')) {
      setImagenSrc(`/productos/${producto.id}.png`)
    } else {
      setImagenRota(true)
    }
  }

  function handleAgregar() {
    if (listaSabores && !saborElegido) {
      setError(true)
      return
    }
    agregarItem(producto.id, 1, saborElegido || null)
    setSaborElegido('')
    setError(false)
  }

  return (
    <div className="card-producto">
      {!imagenRota && (
        <img
          src={imagenSrc}
          alt={producto.nombre}
          onError={handleImagenError}
        />
      )}
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}</p>
      {listaSabores && (
        <select
          className={`selector-sabor${error ? ' selector-sabor--error' : ''}`}
          value={saborElegido}
          onChange={(e) => { setSaborElegido(e.target.value); setError(false) }}
        >
          <option value="">Elegí un sabor</option>
          {listaSabores.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
      {error && <p className="sabor-error">Elegí un sabor primero</p>}
      <button onClick={handleAgregar}>Agregar al carrito</button>
    </div>
  )
}
