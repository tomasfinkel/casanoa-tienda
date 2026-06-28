import { createContext, useContext, useEffect, useState } from 'react'

const BranchContext = createContext(null)
const STORAGE_KEY = 'casanoa-tienda-sucursal'

export const SUCURSALES = {
  castex: { nombre: 'Castex', whatsapp: '5491156182660' },
  siria: { nombre: 'Av. República Árabe Siria', whatsapp: '5491162632425' },
  migueletes: { nombre: 'Migueletes', whatsapp: '5491125638170' },
}

export function BranchProvider({ children }) {
  const [sucursalId, setSucursalId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (sucursalId) {
      localStorage.setItem(STORAGE_KEY, sucursalId)
    }
  }, [sucursalId])

  function elegirSucursal(id) {
    setSucursalId(id)
  }

  function cambiarSucursal() {
    setSucursalId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const sucursal = sucursalId ? SUCURSALES[sucursalId] : null

  return (
    <BranchContext.Provider value={{ sucursalId, sucursal, elegirSucursal, cambiarSucursal }}>
      {children}
    </BranchContext.Provider>
  )
}

export function useSucursal() {
  const ctx = useContext(BranchContext)
  if (!ctx) throw new Error('useSucursal tiene que usarse dentro de BranchProvider')
  return ctx
}
