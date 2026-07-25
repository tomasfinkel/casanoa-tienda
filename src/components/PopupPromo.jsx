import { useEffect, useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import destacadoData from '../data/destacado.json'

const STORAGE_KEY = 'casanoa-tienda-popup-visto'

export default function PopupPromo() {
  const { productos } = useCatalogo()
  const { agregarItem } = useCart()
  const { sucursalId } = useSucursal()
  const [mostrar, setMostrar] = useState(false)
  const [imagenRota, setImagenRota] = useState(false)

  const destacado = sucursalId ? destacadoData[sucursalId] : destacadoData['castex']

  // Buscar en catálogo, pero si no está usar datos del destacado igual
  const productoCatalogo = productos.find((p) => p.id === destacado?.codigo)
  const producto = productoCatalogo || (destacado?.activo ? {
    id: destacado.codigo,
    nombre: destacado.descripcion || destacado.codigo,
    precio: null,
    imagen: `/productos/${destacado.codigo}.jpg`,
  } : null)

  const claveHoy = `${destacado?.codigo}:${sucursalId}:${new Date().toISOString().slice(0, 10)}`

  useEffect(() => {
    if (!destacado?.activo) return
    let visto = null
    try { visto = localStorage.getItem(STORAGE_KEY) } catch {}
    if (visto !== claveHoy) setMostrar(true)
  }, [destacado, claveHoy])

  function cerrar() {
    try { localStorage.setItem(STORAGE_KEY, claveHoy) } catch {}
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
        {productoCatalogo && (
          <button className="popup-agregar" onClick={() => { agregarItem(producto.id); cerrar() }}>
            Agregar al carrito
          </button>
        )}
        {!productoCatalogo && (
          <button className="popup-agregar" onClick={cerrar}>
            Ver en tienda
          </button>
        )}
      </div>
    </div>
  )
}
