import { useState, useRef, useEffect } from 'react'
import { useCatalogo } from '../context/CatalogContext.jsx'
import { useSucursal } from '../context/BranchContext.jsx'
import ProductCard from './ProductCard.jsx'
import CategoryGrid from './CategoryGrid.jsx'
import categorias from '../data/categorias.json'

const LIMITE_RESULTADOS = 500

// Guarda la posición de scroll de cada rubro para restaurarla al volver,
// incluso si el componente se desmonta (por ejemplo al cambiar de pestaña).
const scrollGuardado = {}

const RUBROS_SUGERIDOS = [
  'Snacks', 'Bebidas y jugos', 'Vinos y bebidas selectas', 'Dulces y chocolates',
  'Suplementos y superalimentos', 'Café e infusiones', 'Importados',
  'Lácteos y veganos', 'Congelados',
]

export default function ProductList({ categoriaInicial }) {
  const { productos: todosLosProductos, cargando, error } = useCatalogo()
  const { sucursalId } = useSucursal()
  const [busqueda, setBusqueda] = useState('')
  const [buscadorActivo, setBuscadorActivo] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial || null)
  const inputRef = useRef(null)

  // Restaurar y guardar la posición de scroll de cada rubro
  useEffect(() => {
    const key = categoriaActiva || '__todas__'
    const yGuardado = scrollGuardado[key]
    if (yGuardado) {
      requestAnimationFrame(() => window.scrollTo(0, yGuardado))
    } else {
      window.scrollTo(0, 0)
    }
    function guardarScroll() {
      scrollGuardado[key] = window.scrollY
    }
    window.addEventListener('scroll', guardarScroll, { passive: true })
    return () => {
      guardarScroll()
      window.removeEventListener('scroll', guardarScroll)
    }
  }, [categoriaActiva])

  if (cargando) return <p className="estado">Cargando catálogo...</p>
  if (error) return <p className="estado error">No se pudo cargar el catálogo: {error}</p>

  const sucursalesConDatos = todosLosProductos.sucursalesConDatos
  const sucursalYaSincronizo = sucursalesConDatos?.has(sucursalId) ?? false
  const productos = todosLosProductos.filter((p) => {
    const enEstaSucursal = p.stock ? p.stock[sucursalId] : undefined
    if (enEstaSucursal === undefined || enEstaSucursal === null) return !sucursalYaSincronizo
    return enEstaSucursal > 0
  })

  function aplicarAtajo(categoria) {
    setCategoriaActiva(categoria)
    setBusqueda('')
    setBuscadorActivo(false)
  }

  function cancelarBusqueda() {
    setBusqueda('')
    setBuscadorActivo(false)
    inputRef.current?.blur()
  }

  // Calcular coincidencias
  function buscarProductos(lista, termino) {
    const palabras = termino.trim().toLowerCase().split(/\s+/).filter(Boolean)
    // Primero: marca empieza con el término (prefijo)
    const prefijoDeMarca = lista.filter((p) => {
      const marca = p.nombre.split(' - ')[0].toLowerCase()
      return palabras.every((w) => marca.startsWith(w) || marca.split(' ').some(part => part.startsWith(w)))
    })
    // Segundo: marca contiene el término (pero no empieza)
    const contieneMarca = lista.filter((p) => {
      const marca = p.nombre.split(' - ')[0].toLowerCase()
      return !prefijoDeMarca.includes(p) && palabras.every((w) => marca.includes(w))
    })
    // Tercero: descripción contiene el término
    const enDescripcion = lista.filter((p) => {
      return !prefijoDeMarca.includes(p) && !contieneMarca.includes(p) &&
        palabras.every((w) => p.nombre.toLowerCase().includes(w))
    })
    return [...prefijoDeMarca, ...contieneMarca, ...enDescripcion]
  }

  let coincidencias = []
  if (categoriaActiva && busqueda.trim().length >= 2) {
    const enRubro = productos.filter((p) => (categorias[p.id] || []).includes(categoriaActiva))
    coincidencias = buscarProductos(enRubro, busqueda)
  } else if (categoriaActiva) {
    coincidencias = productos.filter((p) => (categorias[p.id] || []).includes(categoriaActiva))
  } else if (busqueda.trim().length >= 2) {
    coincidencias = buscarProductos(productos, busqueda)
  }

  const resultados = coincidencias.slice(0, LIMITE_RESULTADOS)

  // Vista: buscador activo sin texto → mostrar sugerencias
  if (buscadorActivo && !busqueda && !categoriaActiva) {
    return (
      <div>
        <div className="buscador-barra-activa">
          <input
            ref={inputRef}
            className="buscador-nuevo"
            type="text"
            placeholder="Buscá productos o marcas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />
          <button className="buscador-cancelar" onClick={cancelarBusqueda}>Cancelar</button>
        </div>
        <div className="buscador-sugerencias">
          <p className="sugerencias-titulo">CATEGORÍAS</p>
          {RUBROS_SUGERIDOS.map(r => (
            <button key={r} className="sugerencia-item" onClick={() => aplicarAtajo(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Vista: buscando por texto
  if (buscadorActivo && busqueda.trim().length >= 2) {
    return (
      <div>
        <div className="buscador-barra-activa">
          <input
            ref={inputRef}
            className="buscador-nuevo"
            type="text"
            placeholder="Buscá productos o marcas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />
          <button className="buscador-cancelar" onClick={cancelarBusqueda}>Cancelar</button>
        </div>
        {coincidencias.length === 0 && <p className="estado">No encontramos nada.</p>}
        {coincidencias.length > LIMITE_RESULTADOS && (
          <p className="estado">Mostrando {LIMITE_RESULTADOS} de {coincidencias.length} — escribí algo más específico.</p>
        )}
        <div className="grid-productos" key="busqueda">
          {resultados.map((p) => <ProductCard key={p.id} producto={p} />)}
        </div>
      </div>
    )
  }

  // Vista: dentro de un rubro
  if (categoriaActiva) {
    return (
      <div>
        <div className="buscador-barra-activa">
          <input
            ref={inputRef}
            className="buscador-nuevo"
            type="text"
            placeholder={`Buscá en ${categoriaActiva}...`}
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setBuscadorActivo(true) }}
            onFocus={() => setBuscadorActivo(true)}
          />
          <button className="buscador-cancelar" onClick={() => { setCategoriaActiva(null); setBusqueda(''); setBuscadorActivo(false) }}>Cancelar</button>
        </div>
        <div className="barra-rubro">
          <button className="btn-volver" onClick={() => { setCategoriaActiva(null); setBusqueda('') }}>← Volver</button>
          <span className="rubro-activo-titulo">{categoriaActiva}</span>
        </div>
        {coincidencias.length === 0 && <p className="estado">No encontramos nada.</p>}
        <div className="grid-productos" key={categoriaActiva}>
          {resultados.map((p) => <ProductCard key={p.id} producto={p} />)}
        </div>
      </div>
    )
  }

  // Vista: grilla de categorías (estado inicial)
  return (
    <div>
      <div className="buscador-barra">
        <input
          ref={inputRef}
          className="buscador-nuevo"
          type="text"
          placeholder={`Buscá entre ${productos.length} productos...`}
          value={busqueda}
          onFocus={() => setBuscadorActivo(true)}
          onChange={(e) => { setBusqueda(e.target.value); setBuscadorActivo(true) }}
        />
      </div>
      <CategoryGrid onElegir={aplicarAtajo} />
    </div>
  )
}
