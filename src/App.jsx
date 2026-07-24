import { useState } from 'react'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BranchProvider, useSucursal } from './context/BranchContext.jsx'
import BranchPicker from './components/BranchPicker.jsx'
import Inicio from './components/Inicio.jsx'
import ProductList from './components/ProductList.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import MiCuenta from './components/MiCuenta.jsx'
import PopupPromo from './components/PopupPromo.jsx'
import SelectorEnvio from './components/SelectorEnvio.jsx'

function IconoInicio({ activo }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? '#3c2c23' : '#a89070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconoProductos({ activo }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? '#3c2c23' : '#a89070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function IconoCuenta({ activo }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? '#3c2c23' : '#a89070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconoCarrito({ activo, cantidad }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? '#3c2c23' : '#a89070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {cantidad > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-6px',
          background: '#3c2c23', color: '#e7e3db',
          borderRadius: '50%', width: '16px', height: '16px',
          fontSize: '10px', fontWeight: '700',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{cantidad}</span>
      )}
    </div>
  )
}

function Contenido() {
  const { sucursal, cambiarSucursal } = useSucursal()
  const [tab, setTab] = useState('inicio')
  const [categoriaInicial, setCategoriaInicial] = useState(null)
  const [cartItems, setCartItems] = useState([])

  function irAProductos(categoria) {
    setCategoriaInicial(categoria || null)
    setTab('productos')
  }

  if (!sucursal) return <BranchPicker />

  return (
    <CartProvider onItemsChange={setCartItems}>
      <header className="topbar">
        <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo" />
        <button className="link-cambiar-topbar" onClick={cambiarSucursal}>
          {sucursal.nombre} · cambiar
        </button>
      </header>

      <main className="main-con-navbar">
        {tab === 'inicio' && <Inicio onVerProductos={irAProductos} />}
        {tab === 'productos' && <ProductList categoriaInicial={categoriaInicial} />}
        {tab === 'cuenta' && <MiCuenta />}
      </main>

      <nav className="navbar-inferior">
        <button className={'navbar-item' + (tab === 'inicio' ? ' activo' : '')} onClick={() => setTab('inicio')}>
          <IconoInicio activo={tab === 'inicio'} />
          <span>Inicio</span>
        </button>
        <button className={'navbar-item' + (tab === 'productos' ? ' activo' : '')} onClick={() => irAProductos(null)}>
          <IconoProductos activo={tab === 'productos'} />
          <span>Productos</span>
        </button>
        <button className={'navbar-item' + (tab === 'cuenta' ? ' activo' : '')} onClick={() => setTab('cuenta')}>
          <IconoCuenta activo={tab === 'cuenta'} />
          <span>Mi cuenta</span>
        </button>
        <CartDrawer renderTrigger={(cantidad, abrir) => (
          <button className="navbar-item" onClick={abrir}>
            <IconoCarrito activo={false} cantidad={cantidad} />
            <span>Carrito</span>
          </button>
        )} />
      <SelectorEnvio />
      </nav>
    </CartProvider>
  )
}

export default function App() {
  return (
    <CatalogProvider>
      <BranchProvider>
        <Contenido />
      </BranchProvider>
    </CatalogProvider>
  )
}
