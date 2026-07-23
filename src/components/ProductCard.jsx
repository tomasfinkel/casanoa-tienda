import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import sabores from '../data/sabores.json'
import categorias from '../data/categorias.json'

export default function ProductCard({ producto }) {
  const { agregarItem } = useCart()
  const { sucursalId } = useSucursal()
  const [imagenSrc, setImagenSrc] = useState(`/productos/${producto.id}.jpg`)
  const [imagenRota, setImagenRota] = useState(false)
  const [saborElegido, setSaborElegido] = useState('')
  const [error, setError] = useState(false)

  const listaSabores = sabores[producto.id] || null

  // Separar marca y descripción
  const partes = producto.nombre.split(' - ')
  const marca = partes[0]
  const descripcion = partes.slice(1).join(' - ')

  // Obtener primer rubro
  const rubros = categorias[producto.id] || []
  const rubro = rubros[0] || null

  function handleImagenError() {
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
      <div className="card-imagen">
        {rubro && <span className="card-rubro-badge">{rubro}</span>}
        {!imagenRota ? (
          <img
            src={imagenSrc}
            alt={producto.nombre}
            onError={handleImagenError}
          />
        ) : (
          <div className="imagen-placeholder" />
        )}
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
          {listaSabores.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
      {error && <p className="sabor-error">Elegí un sabor primero</p>}
      <button className="boton-agregar" onClick={handleAgregar}>+</button>
    </div>
  )
}
