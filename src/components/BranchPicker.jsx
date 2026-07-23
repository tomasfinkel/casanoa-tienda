import { useState, useEffect, useRef } from 'react'
import { useSucursal } from '../context/BranchContext.jsx'

const SUCURSALES_GEO = [
  { id: 'castex', nombre: 'Castex', direccion: 'Castex 3390, Palermo', lat: -34.5780548, lng: -58.405876 },
  { id: 'siria', nombre: 'Av. República Árabe Siria', direccion: 'República Árabe Siria 2990, Palermo', lat: -34.5808445, lng: -58.4138029 },
  { id: 'migueletes', nombre: 'Migueletes', direccion: 'Migueletes 984, Palermo', lat: -34.5654665, lng: -58.4361232 },
]

const MAX_DIST_KM = 50

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

function sucursalMasCercana(lat, lng) {
  let mejor = null
  let menorDist = Infinity
  SUCURSALES_GEO.forEach((suc) => {
    const dist = distanciaKm(lat, lng, suc.lat, suc.lng)
    if (dist < menorDist) {
      menorDist = dist
      mejor = { ...suc, distancia: dist }
    }
  })
  return mejor
}

export default function BranchPicker() {
  const { elegirSucursal } = useSucursal()
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [sugerida, setSugerida] = useState(null)
  const [direccion, setDireccion] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (direccion.length < 4) {
      setSugerencias([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(direccion + ', Buenos Aires')
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&countrycodes=ar&viewbox=-58.5333,-34.7050,-58.3333,-34.4800&bounded=0`,
          { headers: { 'Accept-Language': 'es' } }
        )
        const data = await res.json()
        setSugerencias(data || [])
        setMostrarSugerencias(true)
      } catch {
        setSugerencias([])
      }
    }, 400)
  }, [direccion])

  function elegirSugerencia(item) {
    setDireccion(item.display_name.split(',').slice(0, 2).join(','))
    setSugerencias([])
    setMostrarSugerencias(false)
    const lat = parseFloat(item.lat)
    const lng = parseFloat(item.lon)
    const mejor = sucursalMasCercana(lat, lng)
    if (mejor.distancia > MAX_DIST_KM) {
      setError('Esta dirección está fuera del área de cobertura. Podés retirar en una de nuestras sucursales.')
      setSugerida(null)
    } else {
      setError(null)
      setSugerida(mejor)
    }
  }

  function detectarGPS() {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta geolocalización.')
      return
    }
    setBuscando(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const mejor = sucursalMasCercana(pos.coords.latitude, pos.coords.longitude)
        setBuscando(false)
        if (mejor.distancia > MAX_DIST_KM) {
          setError('Estás fuera del área de cobertura. Podés retirar en una de nuestras sucursales.')
        } else {
          setSugerida(mejor)
        }
      },
      () => {
        setBuscando(false)
        setError('No pudimos acceder a tu ubicación.')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="branch-picker">
      <img src="/casa-noa-logo.png" alt="Casa NOA" className="logo-picker" />
      <h2>¿Desde dónde comprás?</h2>
      <p className="picker-sub">Ingresá tu dirección para ver la sucursal más cercana</p>

      {sugerida ? (
        <div className="sugerida-card">
          <p className="sugerida-label">Sucursal más cercana</p>
          <p className="sugerida-nombre">{sugerida.nombre}</p>
          <p className="sugerida-dir">{sugerida.direccion}</p>
          <p className="sugerida-dist">
            A {sugerida.distancia < 1
              ? Math.round(sugerida.distancia * 1000) + ' m'
              : sugerida.distancia.toFixed(1) + ' km'}
          </p>
          <button className="btn-confirmar" onClick={() => elegirSucursal(sugerida.id)}>
            Ir a {sugerida.nombre}
          </button>
          <button className="btn-otra" onClick={() => setSugerida(null)}>
            Elegir otra sucursal
          </button>
        </div>
      ) : (
        <>
          <div className="picker-direccion">
            <div className="autocomplete-wrap">
              <input
                type="text"
                className="input-direccion"
                placeholder="Ej: Av. Santa Fe 1234, CABA"
                value={direccion}
                onChange={(e) => { setDireccion(e.target.value); setError(null) }}
                onFocus={() => sugerencias.length > 0 && setMostrarSugerencias(true)}
                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                autoComplete="off"
              />
              {mostrarSugerencias && sugerencias.length > 0 && (
                <ul className="autocomplete-lista">
                  {sugerencias.map((s, i) => (
                    <li key={i} className="autocomplete-item" onMouseDown={() => elegirSugerencia(s)}>
                      {s.display_name.split(',').slice(0, 3).join(',')}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {error && <p className="picker-error">{error}</p>}

          <div className="picker-divisor"><span>o</span></div>

          <button className="btn-ubicacion" onClick={detectarGPS} disabled={buscando}>
            {buscando ? 'Detectando...' : '📍 Usar mi ubicación actual'}
          </button>

          <div className="picker-divisor"><span>o elegí manualmente</span></div>

          <div className="picker-lista">
            {SUCURSALES_GEO.map((suc) => (
              <button key={suc.id} className="picker-opcion" onClick={() => elegirSucursal(suc.id)}>
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
