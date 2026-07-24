import { useCatalogo } from '../context/CatalogContext.jsx'
import ProductCard from './ProductCard.jsx'
import codigosNovedades from '../data/novedades.json'

export default function Novedades() {
  const { productos } = useCatalogo()

  const items = codigosNovedades
    .map((cod) => productos.find((p) => p.id === cod))
    .filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="fila-novedades">
      {items.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
