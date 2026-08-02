import { useState, useEffect } from 'react'
import { useSucursal } from '../context/BranchContext.jsx'
import { useCatalogo } from '../context/CatalogContext.jsx'
import ProductCard from './ProductCard.jsx'
import Novedades from './Novedades.jsx'

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana. Solo retirando y pagando en el local.', sucursales: null },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes. Solo retirando y pagando en el local.', sucursales: null },
  { nombre: 'Mercado Pago', dia: 'Miércoles y sábados', detalle: '25% de reintegro con tarjeta de crédito Mercado Pago en el Point — tope $15.000 por mes. Solo retirando y pagando en el local.', sucursales: ['siria'] },
  { nombre: 'Megatlon', dia: 'Todos los días', detalle: '15% OFF en efectivo / 10% OFF con cualquier otro medio de pago. Solo retirando y pagando en el local.', sucursales: ['migueletes'] },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra. Solo retirando y pagando en el local.', sucursales: null },
]

const SLIDES = [
  '/insta-1.jpg',
  '/insta-2.jpg',
  '/insta-3.jpg',
  '/insta-4.jpg',
]

const SECCIONES = [
  { titulo: 'Vinos y bebidas selectas', codigos: ['240600', 'PIEL03', 'CHA01', 'CHA02', 'ESTRE1', 'ESTRE2'], categoria: 'Vinos y bebidas selectas' },
  { titulo: 'Seleccionados Casa Noa', codigos: ['10752', 'PONTNUEVA', 'KAY02', '11235', 'WAP', 'INTEGRA02'], categoria: 'Seleccionados Casa NOA' },
  { titulo: 'Wellness', codigos: ['DIABLA08', 'GRACOL', 'MARIA1', 'NAKED04', 'NATIER04', '0011'], categoria: 'Suplementos y superalimentos' },
  { titulo: 'Keto', codigos: ['GRANGER200G', 'BAS', 'BYGIKE', 'ANIMA', 'CHIA28', '714604171942'], categoria: 'Keto' },
  { titulo: 'Importados', codigos: ['8002873021900', 'MINISET', 'SANPE', 'TONY1', 'LINDT88', 'BONNE01'], categoria: 'Importados' },
]

// Chips de acceso rápido debajo del hero
const CHIPS_RAPIDOS = [
  { nombre: 'Novedades', categoria: 'Novedades' },
  { nombre: 'Snacks', categoria: 'Snacks' },
  { nombre: 'Wellness', categoria: 'Suplementos y superalimentos' },
  { nombre: 'Bebidas', categoria: 'Bebidas y jugos' },
  { nombre: 'Chocolates', categoria: 'Dulces y chocolates' },
]

function Carrusel({ onComprar }) {
  const [activo, setActivo] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActivo(p => (p + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="carrusel">
      {SLIDES.map((src, i) => (
        <img key={src} src={src} alt="Casa NOA"
          className={'carrusel-img' + (i === activo ? ' activo' : '')} />
      ))}
      <div className="hero-overlay">
        <h1 className="hero-titulo">Alimentos premium,<br />para una vida mejor</h1>
        <p className="hero-sub">Productos naturales, importados y de las mejores marcas.</p>
        <button className="hero-btn-principal" onClick={onComprar}>Comprar ahora</button>
      </div>
      <div className="carrusel-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={'carrusel-dot' + (i === activo ? ' activo' : '')}
            onClick={() => setActivo(i)} />
        ))}
      </div>
    </div>
  )
}

function BannerFoto({ src, titulo, onTap }) {
  return (
    <div className="banner-foto" onClick={onTap}>
      <img src={src} alt={titulo} className="banner-foto-img" />
      <div className="banner-foto-overlay">
        <span className="banner-foto-titulo">{titulo}</span>
        <span className="banner-foto-flecha">→</span>
      </div>
    </div>
  )
}

function SeccionHorizontal({ titulo, codigos, categoria, onVerTodos }) {
  const { productos } = useCatalogo()
  const items = codigos.map(c => productos.find(p => p.id === c)).filter(Boolean)
  if (items.length === 0) return null
  return (
    <section className="seccion-horizontal">
      <div className="seccion-header">
        <h2 className="seccion-titulo">{titulo}</h2>
        <button className="ver-todas" onClick={() => onVerTodos(categoria)}>Ver todos →</button>
      </div>
      <div className="fila-horizontal">
        {items.map(p => <ProductCard key={p.id} producto={p} />)}
      </div>
    </section>
  )
}

export default function Inicio({ onVerProductos, onBuscar }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">
      <div className="inicio-buscador-wrap">
        <button className="inicio-buscador-fake" onClick={() => onBuscar ? onBuscar() : onVerProductos()}>
          <span>¿Qué estás buscando?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>

      <Carrusel onComprar={() => onVerProductos()} />

      {/* Chips de acceso rápido */}
      <div className="fila-chips-rapidos">
        {CHIPS_RAPIDOS.map((c) => (
          <button key={c.nombre} className="chip-rapido" onClick={() => onVerProductos(c.categoria)}>
            {c.nombre}
          </button>
        ))}
      </div>

      {/* Nuevos ingresos */}
      <section className="seccion-horizontal">
        <div className="seccion-header">
          <h2 className="seccion-titulo">Nuevos ingresos</h2>
          <button className="ver-todas" onClick={() => onVerProductos('Novedades')}>Ver todos →</button>
        </div>
        <Novedades />
      </section>

      {/* Banner 1 */}
      <BannerFoto src="/insta-3.jpg" titulo="LO NUEVO QUE VALE LA PENA CONOCER" onTap={() => onVerProductos()} />

      {/* Secciones con video y banner intercalados */}
      {SECCIONES.map((s, i) => (
        <div key={s.titulo}>
          <SeccionHorizontal
            titulo={s.titulo}
            codigos={s.codigos}
            categoria={s.categoria}
            onVerTodos={onVerProductos}
          />
          {i === 0 && (
            <div className="seccion-video">
              <video src="/hero-video.mp4" autoPlay muted loop playsInline className="hero-video" />
            </div>
          )}
          {i === 2 && (
            <BannerFoto src="/insta-4.jpg" titulo="SELECCIÓN PREMIUM" onTap={() => onVerProductos()} />
          )}
        </div>
      ))}

      {/* Envíos */}
      <section className="seccion-envios">
        <div className="envio-card">
          <span className="envio-icono">🚚</span>
          <div>
            <strong>Envío gratis a Capital Federal</strong>
            <p>En compras desde $55.000</p>
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

      {/* Promos */}
      <section className="seccion-promos-inicio">
        <h2 className="seccion-titulo" style={{padding: '0 1rem'}}>Promociones vigentes</h2>
        <div className="fila-promos">
          {PROMOS.filter(p => !p.sucursales || p.sucursales.includes(sucursalId)).map(p => (
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
