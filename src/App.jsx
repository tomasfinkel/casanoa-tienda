import { useState, useEffect } from 'react'
import { CatalogProvider, useCatalogo } from './context/CatalogContext.jsx'
import { CartProvider, useCart } from './context/CartContext.jsx'
import { BranchProvider, useSucursal, SUCURSALES } from './context/BranchContext.jsx'
import BranchPicker from './components/BranchPicker.jsx'
import Inicio from './components/Inicio.jsx'
import ProductList from './components/ProductList.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import MiCuenta from './components/MiCuenta.jsx'
import PopupPromo from './components/PopupPromo.jsx'
import SelectorEnvio from './components/SelectorEnvio.jsx'

const ENVIO_GRATIS_DESDE = 55000

function BarraEnvioGratis({ onIrAProductos }) {
  const { items } = useCart()
  const { productos } = useCatalogo()
  const total = items.reduce((acc, i) => {
    const p = productos.find(prod => prod.id === i.id)
    return acc + (p ? p.precio * i.cantidad : 0)
  }, 0)
  if (total === 0) return null
  const porcentaje = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100)
  const falta = ENVIO_GRATIS_DESDE - total
  return (
    <div className="barra-envio-gratis barra-envio-gratis--fija" onClick={onIrAProductos}>
      <div className="barra-envio-gratis-texto">
        {falta > 0
          ? <>Te faltan <strong>${falta.toLocaleString('es-AR')}</strong> para envío gratis</>
          : <strong>¡Tu pedido ya tiene envío gratis!</strong>}
      </div>
      <div className="barra-envio-gratis-track">
        <div className="barra-envio-gratis-fill" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  )
}

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
  const { sucursal, sucursalId, elegirSucursal, cambiarSucursal } = useSucursal()
  const [vista, setVista] = useState({ tab: 'inicio', categoriaActiva: null, buscadorActivo: false })
  const [cartItems, setCartItems] = useState([])
  const [selectorSucursalAbierto, setSelectorSucursalAbierto] = useState(false)

  // Al montar, dejamos una entrada base en el historial y escuchamos "atrás"
  // (gesto de deslizar en iOS, botón atrás en Android, o el de arriba del navegador)
  useEffect(() => {
    window.history.replaceState(vista, '')
    function handler(e) {
      if (e.state) setVista(e.state)
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function navegar(cambios) {
    const nuevaVista = { ...vista, ...cambios }
    window.history.pushState(nuevaVista, '')
    setVista(nuevaVista)
  }

  function irAProductos(categoria) {
    navegar({ tab: 'productos', categoriaActiva: categoria || null, buscadorActivo: false })
  }

  function irABuscar() {
    navegar({ tab: 'productos', categoriaActiva: null, buscadorActivo: true })
  }

  function cambiarTab(nuevoTab) {
    navegar({ tab: nuevoTab, categoriaActiva: null, buscadorActivo: false })
  }

  if (!sucursal) return <BranchPicker />

  return (
    <CartProvider onItemsChange={setCartItems}>
      <header className="topbar">
        <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo" />
        <div className="selector-sucursal-wrap">
          <button className="boton-sucursal-pill" onClick={() => setSelectorSucursalAbierto(v => !v)}>
            {sucursal.nombre} <span className="boton-sucursal-chevron">⌄</span>
          </button>
          {selectorSucursalAbierto && (
            <>
              <div className="selector-sucursal-fondo" onClick={() => setSelectorSucursalAbierto(false)} />
              <div className="selector-sucursal-dropdown">
                {Object.entries(SUCURSALES).map(([id, s]) => (
                  <button
                    key={id}
                    className={'selector-sucursal-opcion' + (id === sucursalId ? ' activa' : '')}
                    onClick={() => { elegirSucursal(id); setSelectorSucursalAbierto(false) }}
                  >
                    {s.nombre}
                  </button>
                ))}
                <button className="selector-sucursal-otra" onClick={() => { setSelectorSucursalAbierto(false); cambiarSucursal() }}>
                  Ingresar otra dirección
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="main-con-navbar">
        {vista.tab === 'inicio' && <Inicio onVerProductos={irAProductos} onBuscar={irABuscar} />}
        {vista.tab === 'productos' && (
          <ProductList
            categoriaActiva={vista.categoriaActiva}
            buscadorActivo={vista.buscadorActivo}
            onNavegar={navegar}
            onVolver={() => window.history.back()}
          />
        )}
        {vista.tab === 'cuenta' && <MiCuenta />}
      </main>

      <div className="pie-fijo">
        <BarraEnvioGratis onIrAProductos={() => irAProductos(null)} />
        <nav className="navbar-inferior">
        <button className={'navbar-item' + (vista.tab === 'inicio' ? ' activo' : '')} onClick={() => cambiarTab('inicio')}>
          <IconoInicio activo={vista.tab === 'inicio'} />
          <span>Inicio</span>
        </button>
        <button className={'navbar-item' + (vista.tab === 'productos' ? ' activo' : '')} onClick={() => irAProductos(null)}>
          <IconoProductos activo={vista.tab === 'productos'} />
          <span>Productos</span>
        </button>
        <button className={'navbar-item' + (vista.tab === 'cuenta' ? ' activo' : '')} onClick={() => cambiarTab('cuenta')}>
          <IconoCuenta activo={vista.tab === 'cuenta'} />
          <span>Miembros</span>
        </button>
        <CartDrawer renderTrigger={(cantidad, abrir) => (
          <button className="navbar-item" onClick={abrir}>
            <IconoCarrito activo={false} cantidad={cantidad} />
            <span>Carrito</span>
          </button>
        )} />
    <SelectorEnvio />
      <PopupPromo />
      </nav>
      </div>
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
