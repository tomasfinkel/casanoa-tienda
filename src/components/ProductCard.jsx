import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import sabores from '../data/sabores.json'
import categorias from '../data/categorias.json'

export default function ProductCard({ producto }) {
  const { agregarItem, items, actualizarCantidad } = useCart()
  const [imagenSrc, setImagenSrc] = useState(`/productos/${producto.id}.jpg`)
  const [imagenRota, setImagenRota] = useState(false)
  const [saborElegido, setSaborElegido] = useState('')
  const [errorSabor, setErrorSabor] = useState(false)

  const listaSabores = sabores[producto.id] || null
  const partes = producto.nombre.split(' - ')
  const marca = partes[0]
  const descripcion = partes.slice(1).join(' - ').replace(/ X /g, ' ').replace(/\s+/g, ' ').trim()

  // Buscar si ya está en el carrito
  const itemEnCarrito = items.find((i) => i.id === producto.id && (!listaSabores || i.sabor === saborElegido))
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0

  function handleImagenError() {
    if (imagenSrc.endsWith('.jpg')) setImagenSrc(`/productos/${producto.id}.png`)
    else setImagenRota(true)
  }

  function handleAgregar() {
    if (listaSabores && !saborElegido) { setErrorSabor(true); return }
    agregarItem(producto.id, 1, saborElegido || null)
    setErrorSabor(false)
  }

  function handleRestar() {
    if (!itemEnCarrito) return
    actualizarCantidad(itemEnCarrito.key, cantidadEnCarrito - 1)
  }

  function handleSumar() {
    if (listaSabores && !saborElegido) { setErrorSabor(true); return }
    if (itemEnCarrito) {
      actualizarCantidad(itemEnCarrito.key, cantidadEnCarrito + 1)
    } else {
      agregarItem(producto.id, 1, saborElegido || null)
    }
  }

  return (
    <div className="card-producto">
      <div className="card-imagen">
        {!imagenRota ? (
          <img src={imagenSrc} alt={producto.nombre} onError={handleImagenError} />
        ) : (
          <div className="imagen-placeholder" />
        )}

        {cantidadEnCarrito > 0 ? (
          <div className="control-cantidad">
            <button className="ctrl-btn" onClick={handleRestar}>−</button>
            <span className="ctrl-num">{cantidadEnCarrito}</span>
            <button className="ctrl-btn" onClick={handleSumar}>+</button>
          </div>
        ) : (
          <button className="boton-agregar" onClick={handleAgregar} aria-label="Agregar">+</button>
        )}
      </div>

      <div className="card-info">
        <span className="card-marca">{marca}</span>
        {descripcion && <span className="card-descripcion">{descripcion}</span>}
        <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
      </div>

      {listaSabores && (
        <select
          className={`selector-sabor${errorSabor ? ' selector-sabor--error' : ''}`}
          value={saborElegido}
          onChange={(e) => { setSaborElegido(e.target.value); setErrorSabor(false) }}
        >
          <option value="">Elegí un sabor</option>
          {listaSabores.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
      {errorSabor && <p className="sabor-error">Elegí un sabor primero</p>}
    </div>
  )
}
