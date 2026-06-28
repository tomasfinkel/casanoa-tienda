import { useEffect, useState } from 'react'

// ID del bin de clientes, creado el 28/6.
const JSONBIN_BIN_ID = '6a41818ef5f4af5e293e7862'
const JSONBIN_MASTER_KEY =
  '$2a$10$1BGyO1jHwbMeYO1q//l4cONT1jPzR454VBh9kchyu6xE.xsmMtxz2'
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`

const STORAGE_KEY = 'casanoa-tienda-telefono'

async function leerClientes() {
  const res = await fetch(JSONBIN_URL + '/latest', {
    headers: { 'X-Master-Key': JSONBIN_MASTER_KEY },
  })
  if (!res.ok) throw new Error('No se pudo leer el registro de clientes')
  const data = await res.json()
  return data.record?.clientes ?? {}
}

async function guardarClientes(clientes) {
  const res = await fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_MASTER_KEY,
    },
    body: JSON.stringify({ clientes }),
  })
  if (!res.ok) throw new Error('No se pudo guardar el registro')
}

export default function MiCuenta() {
  const [telefono, setTelefono] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })
  const [cliente, setCliente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [nombreForm, setNombreForm] = useState('')
  const [telefonoForm, setTelefonoForm] = useState('')
  const [emailForm, setEmailForm] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!telefono) {
      setCargando(false)
      return
    }
    leerClientes()
      .then((clientes) => {
        setCliente(clientes[telefono] || null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [telefono])

  async function registrar(e) {
    e.preventDefault()
    if (!nombreForm.trim() || !telefonoForm.trim()) return
    setEnviando(true)
    setError('')
    try {
      const clientes = await leerClientes()
      const telefonoLimpio = telefonoForm.trim()
      const nuevoCliente = {
        nombre: nombreForm.trim(),
        telefono: telefonoLimpio,
        email: emailForm.trim(),
        puntos: 0,
        fechaRegistro: new Date().toISOString(),
      }
      clientes[telefonoLimpio] = nuevoCliente
      await guardarClientes(clientes)
      localStorage.setItem(STORAGE_KEY, telefonoLimpio)
      setTelefono(telefonoLimpio)
      setCliente(nuevoCliente)
    } catch (e) {
      setError('No se pudo registrar: ' + e.message)
    }
    setEnviando(false)
  }

  if (cargando) return <p className="estado">Cargando...</p>

  if (!cliente) {
    return (
      <div className="mi-cuenta">
        <h2>Registrate para sumar puntos</h2>
        <p className="texto-inicio">
          Una vez registrado, vas a tener un código para mostrar en el local
          y sumar puntos en cada compra.
        </p>
        <form onSubmit={registrar} className="form-registro">
          <input
            type="text"
            placeholder="Nombre"
            value={nombreForm}
            onChange={(e) => setNombreForm(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefonoForm}
            onChange={(e) => setTelefonoForm(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email (opcional)"
            value={emailForm}
            onChange={(e) => setEmailForm(e.target.value)}
          />
          {error && <p className="estado error">{error}</p>}
          <button type="submit" disabled={enviando}>
            {enviando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      </div>
    )
  }

  function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEY)
    setTelefono('')
    setCliente(null)
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(cliente.telefono)}`

  return (
    <div className="mi-cuenta">
      <h2>Hola, {cliente.nombre}</h2>
      <p className="puntos-actuales">{cliente.puntos} puntos</p>
      <img src={qrUrl} alt="Tu código" className="qr-cliente" />
      <p className="texto-inicio">
        Mostrá este código en el local para sumar puntos en tu compra.
      </p>
      <button className="link-cerrar-sesion" onClick={cerrarSesion}>
        No soy yo / cerrar sesión
      </button>
    </div>
  )
}
