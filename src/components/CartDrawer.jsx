import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'

export default function CartDrawer() {
  const [abierto, setAbierto] = useState(false)
  const { items, actualizarCantidad, quitarItem, vaciarCarrito } = useCart()
  const { productos } = useCatalogo()
  const { sucursal, cambiarSucursal } = useSucursal()

  const itemsConDatos = items
    .map((item) => {
      const producto = productos.find((p) => p.id === item.id)
      if (!producto) return null
      return { ...item, ...producto }
    })
    .filter(Boolean)

  const total = itemsConDatos.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0)

  function enviarPorWhatsapp() {
    const lineas = itemsConDatos.map((i) => {
      const nombre = i.sabor ? `${i.nombre} — ${i.sabor}` : i.nombre
      return `• ${nombre} x${i.cantidad} — $${i.precio * i.cantidad}`
    })
    const mensaje = [
      `Hola! Quiero hacer un pedido en Casa NOA ${sucursal.nombre}:`,
      '',
      ...lineas,
      '',
      `Total: $${total}`,
    ].join('\n')
    const url = `https://wa.me/${sucursal.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <button className="boton-carrito" onClick={() => setAbierto(true)}>
        Carrito ({cantidadTotal})
      </button>

      {abierto && (
        <div className="carrito-overlay" onClick={() => setAbierto(false)}>
          <div className="carrito-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Tu carrito</h2>
            <p className="sucursal-actual">
              Pidiendo en: <strong>{sucursal?.nombre}</strong>{' '}
              <button className="link-cambiar" onClick={cambiarSucursal}>
                cambiar
              </button>
            </p>

            {itemsConDatos.length === 0 && <p>El carrito está vacío.</p>}

            {itemsConDatos.map((item) => (
              <div key={item.key} className="item-carrito">
                <span>
                  {item.nombre}
                  {item.sabor && <em className="item-sabor"> — {item.sabor}</em>}
                </span>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => actualizarCantidad(item.key, Number(e.target.value))}
                />
                <span>${item.precio * item.cantidad}</span>
                <button onClick={() => quitarItem(item.key)}>Quitar</button>
              </div>
            ))}

            {itemsConDatos.length > 0 && (
              <>
                <p className="total">Total: ${total}</p>
                <div className="info-envio">
                  <p>
                    <strong>Envío gratis a Capital Federal</strong> a partir de $90.000.
                    {total >= 90000
                      ? ' ¡Tu pedido ya califica!'
                      : ` Te faltan $${90000 - total} para llegar.`}
                  </p>
                  <p>
                    <strong>Provincia de Buenos Aires:</strong> hacé el pedido y coordinás
                    con la sucursal para pasar a retirarlo.
                  </p>
                </div>
                <button className="boton-whatsapp" onClick={enviarPorWhatsapp}>
                  Finalizar pedido por WhatsApp
                </button>
                <button onClick={vaciarCarrito}>Vaciar carrito</button>
              </>
            )}

            <button className="cerrar" onClick={() => setAbierto(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
