import { useCatalogo } from '../context/CatalogContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import ProductCard from './ProductCard.jsx'
import codigosNovedades from '../data/novedades.json'

export default function Novedades() {
  const { productos } = useCatalogo()
  const { sucursalId } = useSucursal()

  const items = codigosNovedades
    .map((cod) => productos.find((p) => p.id === cod))
    .filter((p) => {
      if (!p) return false
      // Filtrar por stock de la sucursal activa
      if (!p.stock) return true
      const enEstaSucursal = p.stock[sucursalId]
      if (enEstaSucursal === undefined || enEstaSucursal === null) return true
      return enEstaSucursal > 0
    })

  if (items.length === 0) return null

  return (
    <div className="fila-novedades">
      {items.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
