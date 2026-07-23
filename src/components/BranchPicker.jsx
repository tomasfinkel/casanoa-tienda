import { useState } from 'react'
import { useSucursal } from '../context/BranchContext.jsx'

const SUCURSALES_GEO = [
  { id: 'castex', nombre: 'Castex', direccion: 'Castex 3390, Palermo', lat: -34.5780548, lng: -58.405876 },
  { id: 'siria', nombre: 'Av. República Árabe Siria', direccion: 'República Árabe Siria 2990, Palermo', lat: -34.5808445, lng: -58.4138029 },
  { id: 'migueletes', nombre: 'Migueletes', direccion: 'Migueletes 984, Palermo', lat: -34.5654665, lng: -58.4361232 },
]

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function BranchPicker() {
  const { elegirSucursal } = useSucursal()
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [sugerida, setSugerida] = useState(null)

  function detectarUbicacion() {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta geolocalización.')
      return
    }
    setBuscando(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let masCercana = null
        let menorDist = Infinity
        SUCURSALES_GEO.forEach((suc) => {
          const dist = distanciaKm(latitude, longitude, suc.lat, suc.lng)
          if (dist < menorDist) {
            menorDist = dist
            masCercana = suc
          }
        })
        setBuscando(false)
        setSugerida({ ...masCercana, distancia: menorDist })
      },
      () => {
        setBuscando(false)
        setError('No pudimos acceder a tu ubicación. Elegí una sucursal manualmente.')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="branch-picker">
      <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo-picker" />
      <h2>¿Desde dónde comprás?</h2>
      <p className="picker-sub">Elegí una sucursal para ver el stock disponible</p>

      {sugerida ? (
        <div className="sugerida-card">
          <p className="sugerida-label">Sucursal más cercana</p>
          <p className="sugerida-nombre">{sugerida.nombre}</p>
          <p className="sugerida-dir">{sugerida.direccion}</p>
          <p className="sugerida-dist">A {sugerida.distancia < 1 ? Math.round(sugerida.distancia * 1000) + ' m' : sugerida.distancia.toFixed(1) + ' km'}</p>
          <button className="btn-confirmar" onClick={() => elegirSucursal(sugerida.id)}>
            Ir a {sugerida.nombre}
          </button>
          <button className="btn-otra" onClick={() => setSugerida(null)}>
            Elegir otra sucursal
          </button>
        </div>
      ) : (
        <>
          <button
            className="btn-ubicacion"
            onClick={detectarUbicacion}
            disabled={buscando}
          >
            {buscando ? 'Detectando...' : '📍 Usar mi ubicación'}
          </button>

          {error && <p className="picker-error">{error}</p>}

          <div className="picker-divisor">
            <span>o elegí manualmente</span>
          </div>

          <div className="picker-lista">
            {SUCURSALES_GEO.map((suc) => (
              <button
                key={suc.id}
                className="picker-opcion"
                onClick={() => elegirSucursal(suc.id)}
              >
                <span className="picker-opcion-nombre">{suc.nombre}</span>
                <span className="picker-opcion-dir">{suc.direccion}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
