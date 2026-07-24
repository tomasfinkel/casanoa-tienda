import { useState } from 'react'

const ESTRUCTURA = [
  { nombre: 'Snacks', foto: 'INTEGRA02', subs: ['Snacks'] },
  { nombre: 'Bebidas y jugos', foto: 'GIOR03', subs: ['Bebidas y jugos', 'Café e infusiones', 'Vinos'] },
  { nombre: 'Dulces y chocolates', foto: '11448', subs: ['Dulces y chocolates', 'Galletas', 'Miel, mermeladas y untables', 'Endulzantes'] },
  { nombre: 'Lácteos y veganos', foto: 'FELICES535', subs: ['Lácteos y veganos', 'Huevos', 'Fermentados'] },
  { nombre: 'Congelados', foto: '10207', subs: ['Congelados', 'Helados y postres'] },
  { nombre: 'Almacén', foto: 'RUMMO12', subs: ['Aceites y vinagres', 'Panificados', 'Cereales, legumbres y granolas', 'Harinas y premezclas', 'Pastas, arroces y salsas', 'Conservas', 'Frutos secos y semillas'] },
  { nombre: 'Suplementos y superalimentos', foto: '11100', subs: ['Suplementos y superalimentos', 'Keto', 'Sin gluten / TACC'] },
  { nombre: 'Cuidado personal', foto: '1439', subs: ['Cuidado personal'] },
  { nombre: 'Velas y aromatizantes', foto: 'LOUISLEW09', subs: ['Velas y aromatizantes'] },
]

function FotoCategoria({ foto, nombre }) {
  const [src, setSrc] = useState(`/productos/${foto}.jpg`)
  const [roto, setRoto] = useState(false)
  function onError() {
    if (src.endsWith('.jpg')) setSrc(`/productos/${foto}.png`)
    else setRoto(true)
  }
  if (roto) return <div className="cat-grid-placeholder" />
  return <img src={src} alt={nombre} className="cat-grid-img" onError={onError} />
}

function CatItem({ cat, abierto, onToggle, onElegir }) {
  return (
    <button
      className={'cat-grid-item' + (abierto ? ' abierto' : '')}
      onClick={() => cat.subs.length === 1 ? onElegir(cat.subs[0]) : onToggle()}
    >
      <div className="cat-grid-foto">
        <FotoCategoria foto={cat.foto} nombre={cat.nombre} />
      </div>
      <span className="cat-grid-nombre">{cat.nombre}</span>
      {cat.subs.length > 1 && (
        <span className="cat-grid-chevron">{abierto ? '▲' : '▼'}</span>
      )}
    </button>
  )
}

export default function CategoryGrid({ onElegir }) {
  const [abierto, setAbierto] = useState(null)

  function toggle(nombre) {
    setAbierto(abierto === nombre ? null : nombre)
  }

  // Agrupar en filas de 2
  const filas = []
  for (let i = 0; i < ESTRUCTURA.length; i += 2) {
    filas.push(ESTRUCTURA.slice(i, i + 2))
  }

  return (
    <div className="category-grid-wrap">
      <div className="category-grid">
        {filas.map((fila, fi) => (
          <div key={fi}>
            <div className="cat-grid-fila">
              {fila.map((cat) => (
                <CatItem
                  key={cat.nombre}
                  cat={cat}
                  abierto={abierto === cat.nombre}
                  onToggle={() => toggle(cat.nombre)}
                  onElegir={onElegir}
                />
              ))}
            </div>
            {/* Subrubros del que esté abierto en esta fila */}
            {fila.map((cat) =>
              abierto === cat.nombre && cat.subs.length > 1 ? (
                <div key={cat.nombre + '-subs'} className="cat-subs">
                  {cat.subs.map((sub) => (
                    <button key={sub} className="cat-sub-item" onClick={() => onElegir(sub)}>
                      {sub}
                    </button>
                  ))}
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
