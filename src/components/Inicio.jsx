import { useSucursal } from '../context/BranchContext.jsx'

const NIVELES = [
  { puntos: 50, premio: '5% de descuento' },
  { puntos: 120, premio: '10% de descuento' },
  { puntos: 250, premio: 'Producto de regalo' },
  { puntos: 450, premio: 'Producto premium gratis' },
]

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana' },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes' },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra' },
]

export default function Inicio({ onVerProductos }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">
      <section className="banner-puntos">
        <h2>Sumá puntos en cada compra</h2>
        <p className="banner-puntos-sub">
          1 punto por cada $1.000 gastados, más puntos extra en los
          productos marcados como novedad.
        </p>
        <div className="fila-niveles">
          {NIVELES.map((n) => (
            <div className="pill-nivel" key={n.puntos}>
              <span className="pill-nivel-puntos">{n.puntos}</span>
              <span className="pill-nivel-premio">{n.premio}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="banner-promos">
        <h2>Promociones vigentes</h2>
        <div className="fila-promos">
          {PROMOS.map((p) => (
            <div className="card-promo" key={p.nombre}>
              <span className="card-promo-nombre">{p.nombre}</span>
              <span className="card-promo-dia">{p.dia}</span>
              <span className="card-promo-detalle">{p.detalle}</span>
            </div>
          ))}
          {sucursalId === 'migueletes' && (
            <div className="card-promo">
              <span className="card-promo-nombre">Socios Megatlon</span>
              <span className="card-promo-dia">Todos los días</span>
              <span className="card-promo-detalle">
                10% OFF con cualquier medio de pago — 15% OFF pagando en efectivo
              </span>
            </div>
          )}
        </div>
      </section>

      <button className="boton-ver-productos" onClick={onVerProductos}>
        Ver catálogo
      </button>
    </div>
  )
}
