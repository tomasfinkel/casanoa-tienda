import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import { supabase } from '../supabaseClient.js'

const TELEFONO_KEY = 'casanoa-tienda-telefono'

export default function CartDrawer({ renderTrigger }) {
  const [abierto, setAbierto] = useState(false)
  const { items, actualizarCantidad, quitarItem, vaciarCarrito, tipoEnvio, direccionDelivery } = useCart()
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

  async function enviarPorWhatsapp() {
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
      '',
      `Entrega: ${tipoEnvio === 'delivery' ? 'Delivery' : 'Retiro en el local'}`,
      ...(tipoEnvio === 'delivery' && direccionDelivery ? [`Dirección: ${direccionDelivery}`] : []),
    ].join('\n')
    const url = `https://wa.me/${sucursal.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')

    // Guardar el pedido en Supabase para historial de compras
    try {
      let telefono = null
      try { telefono = localStorage.getItem(TELEFONO_KEY) || null } catch {}
      await supabase.from('pedidos').insert({
        telefono_cliente: telefono,
        sucursal: sucursal.nombre,
        items: itemsConDatos.map((i) => ({
          id: i.id, nombre: i.nombre, sabor: i.sabor, cantidad: i.cantidad, precio: i.precio,
        })),
        total,
        tipo_envio: tipoEnvio,
      })
    } catch {
      // no bloquear el pedido si falla el guardado
    }

    // Notificación por email a Casa NOA
    try {
      const lineasHtml = itemsConDatos.map((i) => {
        const nombre = i.sabor ? `${i.nombre} — ${i.sabor}` : i.nombre
        return `<li>${nombre} x${i.cantidad} — $${(i.precio * i.cantidad).toLocaleString('es-AR')}</li>`
      }).join('')
      await fetch('https://casanoa-pedidos.vercel.app/api/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@casanoa.com.ar',
          subject: `Nuevo pedido — ${sucursal.nombre}`,
          html: `<h2>Nuevo pedido en Casa NOA ${sucursal.nombre}</h2><ul>${lineasHtml}</ul><p><b>Total: $${total.toLocaleString('es-AR')}</b></p>`,
        }),
      })
    } catch {
      // no bloquear si falla el mail
    }
  }

  return (
    <>
      {renderTrigger
        ? renderTrigger(cantidadTotal, () => setAbierto(true))
        : (
          <button className="boton-carrito" onClick={() => setAbierto(true)}>
            Carrito ({cantidadTotal})
          </button>
        )
      }

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
                    <strong>Envío gratis a Capital Federal</strong> a partir de $55.000.
                    {total >= 55000
                      ? ' ¡Tu pedido ya califica!'
                      : ` Te faltan $${55000 - total} para llegar.`}
                  </p>
                  <p>
                    <strong>Provincia de Buenos Aires:</strong> hacé el pedido y coordinás
                    con la sucursal para pasar a retirarlo.
                  </p>
                </div>
                <div className="resumen-pedido">
                  <p><strong>Sucursal:</strong> {sucursal?.nombre}</p>
                  <p><strong>Entrega:</strong> {tipoEnvio === 'delivery' ? 'Delivery' : 'Retiro en el local'}</p>
                  {tipoEnvio === 'delivery' && direccionDelivery && (
                    <p><strong>Dirección:</strong> {direccionDelivery}</p>
                  )}
                  <p><strong>Productos:</strong> {cantidadTotal}</p>
                  <p><strong>Total estimado:</strong> ${total.toLocaleString('es-AR')}</p>
                </div>
                <button className="boton-whatsapp" onClick={enviarPorWhatsapp}>
                  Enviar pedido por WhatsApp
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
