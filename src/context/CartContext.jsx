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

  function agregarItem(id, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === id)
      if (existente) {
        return prev.map((i) =>
          i.id === id ? { ...i, cantidad: i.cantidad + cantidad } : i,
        )
      }
      return [...prev, { id, cantidad }]
    })
  }

  function quitarItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function actualizarCantidad(id, cantidad) {
    if (cantidad <= 0) {
      quitarItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)))
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
