import { useState, useEffect } from 'react'
import { useSucursal } from '../context/BranchContext.jsx'
import { useCatalogo } from '../context/CatalogContext.jsx'
import ProductCard from './ProductCard.jsx'
import Novedades from './Novedades.jsx'

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana', sucursales: null },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes', sucursales: null },
  { nombre: 'Mercado Pago', dia: 'Miércoles y sábados', detalle: '25% de reintegro con tarjeta de crédito Mercado Pago en el Point — tope $15.000 por mes', sucursales: ['siria'] },
  { nombre: 'Megatlon', dia: 'Todos los días', detalle: '15% OFF en efectivo / 10% OFF con cualquier otro medio de pago', sucursales: ['migueletes'] },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra', sucursales: null },
]

const SLIDES = [
  { src: '/insta-1.jpg', alt: 'Casa NOA' },
  { src: '/insta-2.jpg', alt: 'Casa NOA' },
  { src: '/insta-3.jpg', alt: 'Casa NOA' },
  { src: '/insta-4.jpg', alt: 'Casa NOA' },
]

const SECCIONES = [
  {
    titulo: 'Vinos seleccionados',
    codigos: ['240600', 'PIEL03', 'CHA01', 'CHA02', 'ESTRE1', 'ESTRE2'],
  },
  {
    titulo: 'Chocolates premium',
    codigos: ['LINDT01', 'LINDT88', 'TONY2', 'TONYS3', 'TIKDUBAI', 'NOA16'],
  },
  {
    titulo: 'Wellness',
    codigos: ['0008', '0009', '0010', '0011', 'ORMU01', 'NAKED16'],
  },
  {
    titulo: 'Café de especialidad',
    codigos: ['LAV3', 'CAFF8', 'CAFF06', 'DAMM1', 'DAMM2', 'DAMM5'],
  },
  {
    titulo: 'Importados',
    codigos: ['ZUCC002', '8002873021900', 'MINISET', 'SANPE', 'TONY1', 'LINDT88'],
  },
]

function Carrusel({ onComprar }) {
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActivo((prev) => (prev + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="carrusel">
      {SLIDES.map((s, i) => (
        <img key={s.src} src={s.src} alt={s.alt}
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

function SeccionHorizontal({ titulo, codigos, onVerTodos }) {
  const { productos } = useCatalogo()
  const items = codigos.map(c => productos.find(p => p.id === c)).filter(Boolean)
  if (items.length === 0) return null

  return (
    <section className="seccion-horizontal">
      <div className="seccion-cats-header">
        <h2>{titulo}</h2>
        <button className="ver-todas" onClick={onVerTodos}>Ver todos →</button>
      </div>
      <div className="fila-horizontal">
        {items.map(p => <ProductCard key={p.id} producto={p} />)}
      </div>
    </section>
  )
}

export default function Inicio({ onVerProductos }) {
  const { sucursalId } = useSucursal()

  return (
    <div className="inicio">
      <Carrusel onComprar={() => onVerProductos()} />

      <section className="seccion-novedades-inicio">
        <div className="seccion-cats-header">
          <h2>Nuevos ingresos</h2>
          <button className="ver-todas" onClick={() => onVerProductos()}>Ver todos →</button>
        </div>
        <Novedades />
      </section>

      {SECCIONES.map(s => (
        <SeccionHorizontal
          key={s.titulo}
          titulo={s.titulo}
          codigos={s.codigos}
          onVerTodos={() => onVerProductos()}
        />
      ))}

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

      <section className="seccion-promos-inicio">
        <h2>Promociones vigentes</h2>
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

const PROMOS = [
  { nombre: 'Cuenta DNI', dia: 'Lunes a viernes', detalle: '20% OFF — tope $6.000 por semana', sucursales: null },
  { nombre: 'BBVA', dia: 'Martes', detalle: '30% OFF con Visa o Mastercard — tope $12.000 por mes', sucursales: null },
  { nombre: 'Mercado Pago', dia: 'Miércoles y sábados', detalle: '25% de reintegro con tarjeta de crédito Mercado Pago en el Point — tope $15.000 por mes', sucursales: ['siria'] },
  { nombre: 'Megatlon', dia: 'Todos los días', detalle: '15% OFF en efectivo / 10% OFF con cualquier otro medio de pago', sucursales: ['migueletes'] },
  { nombre: 'Efectivo', dia: 'Todos los días', detalle: '10% OFF, sin mínimo de compra', sucursales: null },
]

const SLIDES = [
  { src: '/insta-1.jpg', alt: 'Casa NOA' },
  { src: '/insta-2.jpg', alt: 'Casa NOA' },
  { src: '/insta-3.jpg', alt: 'Casa NOA' },
  { src: '/insta-4.jpg', alt: 'Casa NOA' },
]

function Carrusel({ onComprar }) {
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActivo((prev) => (prev + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="carrusel">
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className={'carrusel-img' + (i === activo ? ' activo' : '')}
        />
      ))}
      <div className="hero-overlay">
        <h1 className="hero-titulo">Alimentos premium,<br />para una vida mejor</h1>
        <p className="hero-sub">Productos naturales, importados y de las mejores marcas.</p>
        <button className="hero-btn-principal" onClick={onComprar}>Comprar ahora</button>
      </div>
      <div className="carrusel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={'carrusel-dot' + (i === activo ? ' activo' : '')}
            onClick={() => setActivo(i)}
          />
        ))}
      </div>
    </div>
  )
}

