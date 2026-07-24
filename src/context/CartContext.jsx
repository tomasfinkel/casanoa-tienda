import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'casanoa-tienda-carrito'
const TIPO_KEY = 'casanoa-tienda-tipo-envio'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  const [tipoEnvio, setTipoEnvio] = useState(() => {
    try { return localStorage.getItem(TIPO_KEY) || null } catch { return null }
  })

  const [pendienteAgregar, setPendienteAgregar] = useState(null)
  const [mostrarSelectorEnvio, setMostrarSelectorEnvio] = useState(false)
  const [direccionDelivery, setDireccionDelivery] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function _agregarReal(id, cantidad, sabor) {
    const key = sabor ? `${id}__${sabor}` : id
    setItems((prev) => {
      const existente = prev.find((i) => i.key === key)
      if (existente) {
        return prev.map((i) => i.key === key ? { ...i, cantidad: i.cantidad + cantidad } : i)
      }
      return [...prev, { key, id, sabor, cantidad }]
    })
  }

  function agregarItem(id, cantidad = 1, sabor = null) {
    if (!tipoEnvio) {
      setPendienteAgregar({ id, cantidad, sabor })
      setMostrarSelectorEnvio(true)
      return
    }
    _agregarReal(id, cantidad, sabor)
  }

  function confirmarTipoEnvio(tipo, direccion = '') {
    setTipoEnvio(tipo)
    setDireccionDelivery(direccion)
    try { localStorage.setItem(TIPO_KEY, tipo) } catch {}
    setMostrarSelectorEnvio(false)
    if (pendienteAgregar) {
      _agregarReal(pendienteAgregar.id, pendienteAgregar.cantidad, pendienteAgregar.sabor)
      setPendienteAgregar(null)
    }
  }

  function quitarItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function actualizarCantidad(key, cantidad) {
    if (cantidad <= 0) { quitarItem(key); return }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, cantidad } : i)))
  }

  function vaciarCarrito() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{
      items, agregarItem, quitarItem, actualizarCantidad, vaciarCarrito,
      tipoEnvio, mostrarSelectorEnvio, setMostrarSelectorEnvio,
      confirmarTipoEnvio, direccionDelivery
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart tiene que usarse dentro de CartProvider')
  return ctx
}
