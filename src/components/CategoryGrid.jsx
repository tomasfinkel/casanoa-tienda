import { useState } from 'react'

const CATEGORIAS = [
  { nombre: 'Snacks', foto: 'INTEGRA02' },
  { nombre: 'Bebidas y jugos', foto: 'GIOR03' },
  { nombre: 'Cuidado personal', foto: '1439' },
  { nombre: 'Suplementos y superalimentos', foto: '11100' },
  { nombre: 'Dulces y chocolates', foto: '11448' },
  { nombre: 'Congelados', foto: '10207' },
  { nombre: 'Café e infusiones', foto: 'LAV3' },
  { nombre: 'Vinos', foto: 'PIEL03' },
  { nombre: 'Lácteos y veganos', foto: 'FELICES535' },
  { nombre: 'Galletas', foto: 'LAZA02' },
  { nombre: 'Aceites y vinagres', foto: 'MIOLI2' },
  { nombre: 'Miel, mermeladas y untables', foto: 'BONNE01' },
  { nombre: 'Panificados', foto: 'BYGIRO' },
  { nombre: 'Cereales, legumbres y granolas', foto: 'JOLLY1' },
  { nombre: 'Harinas y premezclas', foto: 'GRANGER06' },
  { nombre: 'Pastas, arroces y salsas', foto: 'RUMMO12' },
  { nombre: 'Conservas', foto: 'UYTUNA1' },
  { nombre: 'Frutos secos y semillas', foto: 'MANI02' },
  { nombre: 'Carnes y fiambres', foto: 'PANE1' },
  { nombre: 'Fermentados', foto: 'BUNJI01' },
  { nombre: 'Helados y postres', foto: 'HOLSOM9' },
  { nombre: 'Huevos', foto: '00000051' },
  { nombre: 'Sin gluten / TACC', foto: 'ZENEMPA01' },
  { nombre: 'Keto', foto: 'CARMEKETO1' },
  { nombre: 'Endulzantes', foto: '542' },
  { nombre: 'Velas y aromatizantes', foto: 'LOUISLEW09' },
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

export default function CategoryGrid({ onElegir }) {
  return (
    <div className="category-grid-wrap">
      <div className="category-grid">
        {CATEGORIAS.map((cat) => (
          <button key={cat.nombre} className="cat-grid-item" onClick={() => onElegir(cat.nombre)}>
            <div className="cat-grid-foto">
              <FotoCategoria foto={cat.foto} nombre={cat.nombre} />
            </div>
            <span className="cat-grid-nombre">{cat.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
