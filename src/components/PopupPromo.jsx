import { useEffect, useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import destacado from '../data/destacado.json'

const STORAGE_KEY = 'casanoa-tienda-popup-visto'

export default function PopupPromo() {
  const { productos } = useCatalogo()
  const { agregarItem } = useCart()
  const [mostrar, setMostrar] = useState(false)
  const [imagenRota, setImagenRota] = useState(false)

  const producto = productos.find((p) => p.id === destacado.codigo)
  const claveHoy = `${destacado.codigo}:${new Date().toISOString().slice(0, 10)}`

  useEffect(() => {
    if (!destacado.activo || !producto) return
    let visto = null
    try {
      visto = localStorage.getItem(STORAGE_KEY)
    } catch {
      visto = null
    }
    if (visto !== claveHoy) {
      setMostrar(true)
    }
  }, [producto, claveHoy])

  function cerrar() {
    try {
      localStorage.setItem(STORAGE_KEY, claveHoy)
    } catch {
      // si falla, simplemente vuelve a aparecer la próxima vez, no es grave
    }
    setMostrar(false)
  }

  if (!mostrar || !producto) return null

  return (
    <div className="popup-overlay" onClick={cerrar}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-cerrar" onClick={cerrar} aria-label="Cerrar">
          ×
        </button>
        {producto.imagen && !imagenRota && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            onError={() => setImagenRota(true)}
          />
        )}
        <span className="popup-etiqueta">{destacado.etiqueta}</span>
        <h3>{producto.nombre}</h3>
        <p className="popup-precio">${producto.precio}</p>
        <button
          className="popup-agregar"
          onClick={() => {
            agregarItem(producto.id)
            cerrar()
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}
