import { CatalogProvider } from './context/CatalogContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import ProductList from './components/ProductList.jsx'
import CartDrawer from './components/CartDrawer.jsx'

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <header className="topbar">
          <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo" />
        </header>
        <main>
          <ProductList />
        </main>
        <CartDrawer />
      </CartProvider>
    </CatalogProvider>
  )
}
