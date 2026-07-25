import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useCatalogo } from '../context/CatalogContext.jsx'

const STORAGE_KEY = 'casanoa-popup-true-dates'

export default function PopupPromo() {
  const { agregarItem } = useCart()
  const { productos } = useCatalogo()
  const [imagenRota, setImagenRota] = useState(false)

  const [cerrado, setCerrado] = useState(() => {
    try {
      const hoy = new Date().toISOString().slice(0, 10)
      return localStorage.getItem(STORAGE_KEY) === hoy
    } catch {
      return false
    }
  })

  function cerrar() {
    try {
      const hoy = new Date().toISOString().slice(0, 10)
      localStorage.setItem(STORAGE_KEY, hoy)
    } catch {}
    setCerrado(true)
  }

  if (cerrado) return null

  const productoCatalogo = productos.find(p => p.id === 'TRUE')

  return (
    <div className="popup-overlay" onClick={cerrar}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <button className="popup-cerrar" onClick={cerrar}>×</button>
        {!imagenRota && (
          <img
            src="/productos/TRUE.jpg"
            alt="True Dates"
            onError={() => setImagenRota(true)}
          />
        )}
        <span className="popup-etiqueta">Exclusivo Casa NOA</span>
        <h3>True Dates</h3>
        <p className="popup-descripcion">Dátiles saborizados sin azúcar</p>
        {productoCatalogo && <p className="popup-precio">${productoCatalogo.precio}</p>}
        {productoCatalogo ? (
          <button className="popup-agregar" onClick={() => { agregarItem('TRUE'); cerrar() }}>
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
