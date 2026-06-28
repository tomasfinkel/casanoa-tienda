import { useSucursal } from '../context/BranchContext.jsx'

export default function Inicio({ onVerProductos }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">
      <section className="bloque-inicio">
        <h2>Sumá puntos en cada compra</h2>
        <p className="texto-inicio">
          Ganás 1 punto por cada $1.000 que gastás, más puntos extra en los
          productos marcados como novedad.
        </p>
        <ul className="lista-niveles">
          <li><strong>50 puntos</strong> — 5% de descuento en tu próxima compra</li>
          <li><strong>120 puntos</strong> — 10% de descuento</li>
          <li><strong>250 puntos</strong> — un producto de regalo</li>
          <li><strong>450 puntos</strong> — un producto premium gratis</li>
        </ul>
      </section>

      <section className="bloque-inicio">
        <h2>Promociones vigentes</h2>
        {/* AJUSTAR: porcentajes y condiciones reales pendientes */}
        <ul className="lista-promos">
          <li>Cuenta DNI — descuento a confirmar</li>
          <li>BBVA — descuento a confirmar</li>
          <li>Efectivo — descuento a confirmar</li>
          {sucursalId === 'migueletes' && (
            <li>Socio Megatlon — descuento a confirmar (solo Migueletes)</li>
          )}
        </ul>
      </section>

      <button className="boton-ver-productos" onClick={onVerProductos}>
        Ver catálogo
      </button>
    </div>
  )
}
