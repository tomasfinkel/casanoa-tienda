import { useSucursal } from '../context/BranchContext.jsx'
import Novedades from './Novedades.jsx'

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana', sucursales: null },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes', sucursales: null },
  { nombre: 'Mercado Pago', dia: 'Miércoles y sábados', detalle: '25% de reintegro con tarjeta de crédito Mercado Pago en el Point — tope $15.000 por mes', sucursales: ['siria'] },
  { nombre: 'Megatlon', dia: 'Todos los días', detalle: '15% OFF en efectivo / 10% OFF con cualquier otro medio de pago', sucursales: ['migueletes'] },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra', sucursales: null },
]

const CATEGORIAS_INICIO = [
  { nombre: 'Snacks', emoji: '🍿' },
  { nombre: 'Bebidas y jugos', emoji: '🥤' },
  { nombre: 'Cuidado personal', emoji: '✨' },
  { nombre: 'Suplementos y superalimentos', emoji: '💊' },
  { nombre: 'Dulces y chocolates', emoji: '🍫' },
  { nombre: 'Congelados', emoji: '🧊' },
  { nombre: 'Café e infusiones', emoji: '☕' },
  { nombre: 'Vinos', emoji: '🍷' },
]

const BENEFICIOS = [
  { icono: '🚚', titulo: 'Envío gratis', sub: 'Desde $90.000 en CABA' },
  { icono: '🌍', titulo: 'Importados', sub: 'Productos seleccionados' },
  { icono: '⭐', titulo: 'Premium', sub: 'Las mejores marcas' },
  { icono: '💬', titulo: 'Atención', sub: 'Personalizada' },
]

export default function Inicio({ onVerProductos }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">

      {/* HERO */}
      <section className="hero">
        <img src="/insta-1.jpg" alt="Casa NOA" className="hero-img" />
        <div className="hero-overlay">
          <h1 className="hero-titulo">Alimentos premium,<br />para una vida mejor</h1>
          <p className="hero-sub">Productos naturales, importados y de las mejores marcas.</p>
          <button className="hero-btn-principal" onClick={() => onVerProductos()}>Comprar ahora</button>
          <button className="hero-btn-secundario" onClick={() => onVerProductos()}>Ver categorías</button>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="seccion-beneficios">
        {BENEFICIOS.map((b) => (
          <div className="beneficio" key={b.titulo}>
            <span className="beneficio-icono">{b.icono}</span>
            <span className="beneficio-titulo">{b.titulo}</span>
            <span className="beneficio-sub">{b.sub}</span>
          </div>
        ))}
      </section>

      {/* CATEGORÍAS */}
      <section className="seccion-cats-inicio">
        <div className="seccion-cats-header">
          <h2>Categorías</h2>
          <button className="ver-todas" onClick={() => onVerProductos()}>Ver todas →</button>
        </div>
        <div className="fila-cats-inicio">
          {CATEGORIAS_INICIO.map((cat) => (
            <button key={cat.nombre} className="cat-circulo" onClick={() => onVerProductos(cat.nombre)}>
              <span className="cat-circulo-emoji">{cat.emoji}</span>
              <span className="cat-circulo-nombre">{cat.nombre.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* NOVEDADES */}
      <section className="seccion-novedades-inicio">
        <div className="seccion-cats-header">
          <h2>Nuevos ingresos</h2>
          <button className="ver-todas" onClick={() => onVerProductos()}>Ver todos →</button>
        </div>
        <Novedades />
      </section>

      {/* ENVÍOS */}
      <section className="seccion-envios">
        <div className="envio-card">
          <span className="envio-icono">🚚</span>
          <div>
            <strong>Envío gratis a Capital Federal</strong>
            <p>En compras desde $90.000</p>
          </div>
        </div>
        <div className="envio-card">
          <span className="envio-icono">📦</span>
          <div>
            <strong>Provincia de Buenos Aires</strong>
            <p>Pedí y retirá en la sucursal</p>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="seccion-promos-inicio">
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

    </div>
  )
}
