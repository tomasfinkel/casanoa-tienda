import { CatalogProvider } from './context/CatalogContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BranchProvider, useSucursal } from './context/BranchContext.jsx'
import BranchPicker from './components/BranchPicker.jsx'
import ProductList from './components/ProductList.jsx'
import CartDrawer from './components/CartDrawer.jsx'

function Contenido() {
  const { sucursal, cambiarSucursal } = useSucursal()

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
      <main>
        <ProductList />
      </main>
      <CartDrawer />
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
