import { useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import destacadoData from '../data/destacado.json'

const STORAGE_KEY = 'casanoa-tienda-popup-visto'

function yaVisto(codigo) {
  try {
    const clave = `${codigo}:${new Date().toISOString().slice(0, 10)}`
    return localStorage.getItem(STORAGE_KEY) === clave
  } catch {
    return false
  }
}

function marcarVisto(codigo) {
  try {
    const clave = `${codigo}:${new Date().toISOString().slice(0, 10)}`
    localStorage.setItem(STORAGE_KEY, clave)
  } catch {}
}

export default function PopupPromo() {
  const { productos } = useCatalogo()
  const { agregarItem } = useCart()
  const { sucursalId } = useSucursal()

  const sucId = sucursalId || 'castex'
  const destacado = destacadoData[sucId] || destacadoData['castex']

  const [mostrar, setMostrar] = useState(() => {
    if (!destacado?.activo) return false
    return !yaVisto(destacado.codigo)
  })

  const [imagenRota, setImagenRota] = useState(false)

  const productoCatalogo = productos.find((p) => p.id === destacado?.codigo)
  const producto = productoCatalogo || (destacado?.activo ? {
    id: destacado.codigo,
    nombre: destacado.descripcion || destacado.codigo,
    precio: null,
    imagen: `/productos/${destacado.codigo}.jpg`,
  } : null)

  function cerrar() {
    marcarVisto(destacado.codigo)
    setMostrar(false)
  }

  if (!mostrar || !producto) return null

  return (
    <div className="popup-overlay" onClick={cerrar}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-cerrar" onClick={cerrar} aria-label="Cerrar">×</button>
        {!imagenRota && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            onError={() => setImagenRota(true)}
          />
        )}
        <span className="popup-etiqueta">{destacado.etiqueta}</span>
        <h3>{producto.nombre}</h3>
        {destacado.descripcion && <p className="popup-descripcion">{destacado.descripcion}</p>}
        {producto.precio && <p className="popup-precio">${producto.precio}</p>}
        {productoCatalogo ? (
          <button className="popup-agregar" onClick={() => { agregarItem(producto.id); cerrar() }}>
            Agregar al carrito
          </button>
        ) : (
          <button className="popup-agregar" onClick={cerrar}>
            Ver en tienda
          </button>
        )}
      </div>
    </div>
  )
}
