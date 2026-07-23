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

function Contenido() {
  const { sucursal, cambiarSucursal } = useSucursal()
  const [tab, setTab] = useState('inicio')
  const [categoriaInicial, setCategoriaInicial] = useState(null)

  function irAProductos(categoria) {
    setCategoriaInicial(categoria || null)
    setTab('productos')
  }

  if (!sucursal) {
    return <BranchPicker />
  }

  return (
    <CartProvider>
      <header className="topbar">
        <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo" />
        <button className="link-cambiar-topbar" onClick={cambiarSucursal}>
          {sucursal.nombre} · cambiar
        </button>
      </header>

      <nav className="tabs-principales">
        <button
          className={'tab-principal' + (tab === 'inicio' ? ' activo' : '')}
          onClick={() => setTab('inicio')}
        >
          Inicio
        </button>
        <button
          className={'tab-principal' + (tab === 'productos' ? ' activo' : '')}
          onClick={() => setTab('productos')}
        >
          Productos
        </button>
        <button
          className={'tab-principal' + (tab === 'cuenta' ? ' activo' : '')}
          onClick={() => setTab('cuenta')}
        >
          Mi cuenta
        </button>
      </nav>

      <main>
        {tab === 'inicio' && <Inicio onVerProductos={irAProductos} />}
        {tab === 'productos' && <ProductList categoriaInicial={categoriaInicial} />}
        {tab === 'cuenta' && <MiCuenta />}
      </main>
      <CartDrawer />
      <PopupPromo />
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
