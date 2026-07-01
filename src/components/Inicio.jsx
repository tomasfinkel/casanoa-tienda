import { useSucursal } from '../context/BranchContext.jsx'
import Novedades from './Novedades.jsx'
import InstagramFeed from './InstagramFeed.jsx'

const NIVELES = [
  { puntos: 50, premio: '5% de descuento' },
  { puntos: 120, premio: '10% de descuento' },
  { puntos: 250, premio: 'Producto de regalo' },
  { puntos: 450, premio: 'Producto premium gratis' },
]

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana', sucursales: null },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes', sucursales: null },
  { nombre: 'Mercado Pago', dia: 'Miércoles y sábados', detalle: '25% de reintegro con tarjeta de crédito Mercado Pago en el Point — tope $15.000 por mes', sucursales: ['siria'] },
  { nombre: 'Megatlon', dia: 'Todos los días', detalle: '15% OFF en efectivo / 10% OFF con cualquier otro medio de pago', sucursales: ['migueletes'] },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra', sucursales: null },
]

const CATEGORIAS_DESTACADAS = [
  'Vinos',
  'Lácteos',
  'Snacks',
  'Dulces y chocolates',
  'Suplementos y superalimentos',
  'Cuidado personal',
  'Café e infusiones',
  'Congelados',
]

export default function Inicio({ onVerProductos }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">
      <Novedades />
      <InstagramFeed />

      <section className="seccion-categorias">
        <h2>Categorías</h2>
        <div className="grid-categorias-inicio">
          {CATEGORIAS_DESTACADAS.map((cat) => (
            <button
              key={cat}
              className="boton-categoria-inicio"
              onClick={() => onVerProductos(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

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
        <h2>Envíos y retiro</h2>
        <div className="fila-promos">
          <div className="card-promo">
            <span className="card-promo-nombre">Capital Federal</span>
            <span className="card-promo-dia">Envío gratis desde $90.000</span>
          </div>
          <div className="card-promo">
            <span className="card-promo-nombre">Provincia de Buenos Aires</span>
            <span className="card-promo-dia">Hacé el pedido y retirá en la sucursal</span>
          </div>
        </div>
      </section>

      <section className="banner-promos">
        <h2>Promociones vigentes</h2>
        <div className="fila-promos">
          {PROMOS.filter((p) => !p.sucursales || p.sucursales.includes(sucursalId)).map((p) => (
            <div className="card-promo" key={p.nombre}>
              <span className="card-promo-nombre">{p.nombre}</span>
              <span className="card-promo-dia">{p.dia}</span>
              <span className="card-promo-detalle">{p.detalle}</span>
            </div>
          ))}
        </div>
      </section>

      <button className="boton-ver-productos" onClick={() => onVerProductos()}>
        Ver catálogo completo
      </button>
    </div>
  )
}
