import { useSucursal, SUCURSALES } from '../context/BranchContext.jsx'

export default function BranchPicker() {
  const { elegirSucursal } = useSucursal()

  return (
    <div className="selector-sucursal">
      <h2>¿Desde qué sucursal vas a pedir?</h2>
      <p>Tu pedido se envía por WhatsApp a esa sucursal para coordinar el pago y la entrega.</p>
      {Object.entries(SUCURSALES).map(([id, s]) => (
        <button key={id} className="boton-sucursal" onClick={() => elegirSucursal(id)}>
          {s.nombre}
        </button>
      ))}
    </div>
  )
}
