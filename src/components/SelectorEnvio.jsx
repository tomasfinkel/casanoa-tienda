import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function SelectorEnvio() {
  const { mostrarSelectorEnvio, setMostrarSelectorEnvio, confirmarTipoEnvio } = useCart()
  const [paso, setPaso] = useState('elegir') // 'elegir' | 'direccion'
  const [direccion, setDireccion] = useState('')

  if (!mostrarSelectorEnvio) return null

  function elegir(tipo) {
    if (tipo === 'delivery') {
      setPaso('direccion')
    } else {
      confirmarTipoEnvio('retiro')
      setPaso('elegir')
    }
  }

  function confirmarDelivery() {
    confirmarTipoEnvio('delivery', direccion)
    setPaso('elegir')
    setDireccion('')
  }

  return (
    <div className="selector-envio-overlay" onClick={() => { setMostrarSelectorEnvio(false); setPaso('elegir') }}>
      <div className="selector-envio-panel" onClick={(e) => e.stopPropagation()}>
        {paso === 'elegir' ? (
          <>
            <h3>¿Cómo querés recibir tu pedido?</h3>
            <button className="envio-opcion retiro" onClick={() => elegir('retiro')}>
              <span className="envio-opcion-icono">🏪</span>
              <div>
                <strong>Retirar en el local</strong>
                <p>Coordinás por WhatsApp con la sucursal</p>
              </div>
            </button>
            <button className="envio-opcion delivery" onClick={() => elegir('delivery')}>
              <span className="envio-opcion-icono">🚚</span>
              <div>
                <strong>Delivery</strong>
                <p>Gratis desde $90.000 en CABA. El costo se coordina por WhatsApp.</p>
              </div>
            </button>
            <button className="envio-cancelar" onClick={() => { setMostrarSelectorEnvio(false); setPaso('elegir') }}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h3>¿A qué dirección enviamos?</h3>
            <input
              className="input-direccion-envio"
              type="text"
              placeholder="Ej: Av. Corrientes 1234, CABA"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              autoFocus
            />
            <button
              className="btn-confirmar-delivery"
              onClick={confirmarDelivery}
              disabled={!direccion.trim()}
            >
              Confirmar dirección
            </button>
            <button className="envio-cancelar" onClick={() => setPaso('elegir')}>
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  )
}
