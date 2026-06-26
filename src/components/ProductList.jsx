import { useCatalogo } from '../context/CatalogContext.jsx'
import ProductCard from './ProductCard.jsx'

export default function ProductList() {
  const { productos, cargando, error } = useCatalogo()

  if (cargando) return <p className="estado">Cargando productos...</p>
  if (error)
    return <p className="estado error">No se pudo cargar el catálogo: {error}</p>

  return (
    <div className="grid-productos">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
