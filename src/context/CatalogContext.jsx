import { createContext, useContext, useEffect, useState } from 'react'
import { obtenerCatalogoCompleto } from '../lib/catalogo.js'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerCatalogoCompleto()
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <CatalogContext.Provider value={{ productos, cargando, error }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalogo() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalogo tiene que usarse dentro de CatalogProvider')
  return ctx
}
