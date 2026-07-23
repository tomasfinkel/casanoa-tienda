import { useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import categorias from '../data/categorias.json'
import sabores from '../data/sabores.json'
import codigosNovedades from '../data/novedades.json'

function TarjetaNovedad({ producto }) {
  const { agregarItem } = useCart()
  const [imagenSrc, setImagenSrc] = useState(`/productos/${producto.id}.jpg`)
  const [imagenRota, setImagenRota] = useState(false)
  const [saborElegido, setSaborElegido] = useState('')
  const [error, setError] = useState(false)

  const listaSabores = sabores[producto.id] || null
  const partes = producto.nombre.split(' - ')
  const marca = partes[0]
  const descripcion = partes.slice(1).join(' - ').replace(/ X /g, ' ').replace(/\s+/g, ' ').trim()
  const rubro = (categorias[producto.id] || [])[0] || null

  function handleImagenError() {
    if (imagenSrc.endsWith('.jpg')) {
      setImagenSrc(`/productos/${producto.id}.png`)
    } else {
      setImagenRota(true)
    }
  }

  function handleAgregar() {
    if (listaSabores && !saborElegido) { setError(true); return }
    agregarItem(producto.id, 1, saborElegido || null)
    setSaborElegido('')
    setError(false)
  }

  return (
    <div className="card-producto">
      <div className="card-imagen">
        {!imagenRota ? (
          <img src={imagenSrc} alt={producto.nombre} onError={handleImagenError} />
        ) : (
          <div className="imagen-placeholder" />
        )}
        <button className="boton-agregar" onClick={handleAgregar} aria-label="Agregar">+</button>
      </div>
      <div className="card-info">
        <span className="card-marca">{marca}</span>
        {descripcion && <span className="card-descripcion">{descripcion}</span>}
        <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
      </div>
      {listaSabores && (
        <select
          className={`selector-sabor${error ? ' selector-sabor--error' : ''}`}
          value={saborElegido}
          onChange={(e) => { setSaborElegido(e.target.value); setError(false) }}
        >
          <option value="">Elegí un sabor</option>
          {listaSabores.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
      {error && <p className="sabor-error">Elegí un sabor primero</p>}
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
    <div className="fila-novedades">
      {items.map((p) => (
        <TarjetaNovedad key={p.id} producto={p} />
      ))}
    </div>
  )
}
