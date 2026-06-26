import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ producto }) {
  const { agregarItem } = useCart()

  return (
    <div className="card-producto">
      {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}</p>
      <button onClick={() => agregarItem(producto.id)}>Agregar al carrito</button>
    </div>
  )
}
