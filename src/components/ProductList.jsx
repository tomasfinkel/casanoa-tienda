import { useState } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import ProductCard from './ProductCard.jsx'
import CategoryGrid from './CategoryGrid.jsx'
import categorias from '../data/categorias.json'

const LIMITE_RESULTADOS = 500

const ATAJOS = [
  'Vinos',
  'Lácteos y veganos',
  'Snacks',
  'Galletas',
  'Aceites y vinagres',
  'Café e infusiones',
  'Dulces y chocolates',
  'Miel, mermeladas y untables',
  'Panificados',
  'Congelados',
  'Helados y postres',
  'Condimentos, especias y dips',
  'Suplementos y superalimentos',
  'Cereales, legumbres y granolas',
  'Harinas y premezclas',
  'Bebidas y jugos',
  'Pastas, arroces y salsas',
  'Conservas',
  'Frutos secos y semillas',
  'Huevos',
  'Carnes y fiambres',
  'Cuidado personal',
  'Fermentados',
  'Sin gluten / TACC',
  'Keto',
  'Velas y aromatizantes',
  'Endulzantes',
]

export default function ProductList({ categoriaInicial }) {
  const { productos: todosLosProductos, cargando, error } = useCatalogo()
  const { sucursalId } = useSucursal()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial || null)

  if (cargando) return <p className="estado">Cargando catálogo...</p>
  if (error)
    return <p className="estado error">No se pudo cargar el catálogo: {error}</p>

  // Si la sucursal todavía no sincronizó ningún producto hoy, fallamos
  // abierto (puede ser que el cron no llegó todavía). Si ya sincronizó,
  // un producto ausente o sin esa sucursal en su stock significa que
  // de verdad no hay stock ahí — se oculta.
  const sucursalesConDatos = todosLosProductos.sucursalesConDatos
  const sucursalYaSincronizo = sucursalesConDatos?.has(sucursalId) ?? false
  const productos = todosLosProductos.filter((p) => {
    const enEstaSucursal = p.stock ? p.stock[sucursalId] : undefined
    if (enEstaSucursal === undefined || enEstaSucursal === null) {
      return !sucursalYaSincronizo
    }
    return enEstaSucursal > 0
  })

  function buscarTexto(valor) {
    setBusqueda(valor)
    setCategoriaActiva(null)
  }

  function aplicarAtajo(categoria) {
    setCategoriaActiva(categoria)
    setBusqueda('')
  }

  let coincidencias = []
  if (categoriaActiva) {
    coincidencias = productos.filter((p) => (categorias[p.id] || []).includes(categoriaActiva))
  } else if (busqueda.trim().length >= 2) {
    const palabras = busqueda.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const todos = productos.filter((p) => {
      const nombre = p.nombre.toLowerCase()
      return palabras.every((palabra) => nombre.includes(palabra))
    })
    // Priorizar los que coinciden en la marca (antes del guion)
    const enMarca = todos.filter((p) => {
      const marca = p.nombre.split(' - ')[0].toLowerCase()
      return palabras.every((palabra) => marca.includes(palabra))
    })
    const enDescripcion = todos.filter((p) => {
      const marca = p.nombre.split(' - ')[0].toLowerCase()
      return !palabras.every((palabra) => marca.includes(palabra))
    })
    coincidencias = [...enMarca, ...enDescripcion]
  }
  const resultados = coincidencias.slice(0, LIMITE_RESULTADOS)
  const buscando = categoriaActiva || busqueda.trim().length >= 2

  // Si no hay búsqueda ni categoría activa, mostrar grilla de categorías
  if (!buscando) {
    return (
      <div>
        <input
          className="buscador"
          type="text"
          placeholder={`Buscá entre ${productos.length} productos...`}
          value={busqueda}
          onChange={(e) => buscarTexto(e.target.value)}
        />
        <CategoryGrid onElegir={(cat) => aplicarAtajo(cat)} />
      </div>
    )
  }

  return (
    <div>
      <input
        className="buscador"
        type="text"
        placeholder={`Buscá entre ${productos.length} productos...`}
        value={busqueda}
        onChange={(e) => buscarTexto(e.target.value)}
      />

      {categoriaActiva && (
        <div className="barra-rubro">
          <button className="btn-volver" onClick={() => setCategoriaActiva(null)}>
            ← Volver
          </button>
          <span className="rubro-activo-titulo">{categoriaActiva}</span>
        </div>
      )}

      {busqueda.trim().length >= 2 && !categoriaActiva && (
        <div className="atajos">
          {ATAJOS.map((cat) => (
            <button
              key={cat}
              className={'boton-atajo' + (categoriaActiva === cat ? ' activo' : '')}
              onClick={() => aplicarAtajo(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {buscando && coincidencias.length === 0 && (
        <p className="estado">No encontramos nada.</p>
      )}
      {coincidencias.length > LIMITE_RESULTADOS && (
        <p className="estado">
          Mostrando los primeros {LIMITE_RESULTADOS} de {coincidencias.length} resultados — escribí algo más específico.
        </p>
      )}

      <div className="grid-productos" key={categoriaActiva || busqueda}>
        {resultados.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  )
}
