import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'casanoa-tienda-carrito'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function agregarItem(id, cantidad = 1, sabor = null) {
    const key = sabor ? `${id}__${sabor}` : id
    setItems((prev) => {
      const existente = prev.find((i) => i.key === key)
      if (existente) {
        return prev.map((i) =>
          i.key === key ? { ...i, cantidad: i.cantidad + cantidad } : i,
        )
      }
      return [...prev, { key, id, sabor, cantidad }]
    })
  }

  function quitarItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function actualizarCantidad(key, cantidad) {
    if (cantidad <= 0) {
      quitarItem(key)
      return
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, cantidad } : i)))
  }

  function vaciarCarrito() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, agregarItem, quitarItem, actualizarCantidad, vaciarCarrito }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart tiene que usarse dentro de CartProvider')
  return ctx
}
