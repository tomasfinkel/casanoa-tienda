import { useEffect, useState } from 'react'

// ID del bin de clientes, creado el 28/6.
const JSONBIN_BIN_ID = '6a41818ef5f4af5e293e7862'
const JSONBIN_MASTER_KEY =
  '$2a$10$1BGyO1jHwbMeYO1q//l4cONT1jPzR454VBh9kchyu6xE.xsmMtxz2'
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`

const ENVIAR_EMAIL_URL = 'https://casanoa-pedidos.vercel.app/api/enviar-email'

function htmlBienvenida(nombre) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
      <div style="background:#3c2c23;color:#e7e3db;padding:24px">
        <h1 style="margin:0;font-size:20px;letter-spacing:1px">CASA NOA</h1>
      </div>
      <div style="padding:24px;color:#3c2c23">
        <p>Hola, ${nombre}!</p>
        <p>Gracias por registrarte. A partir de ahora, cada compra que hagas con nosotros — en el local o por WhatsApp — suma puntos:</p>
        <ul style="line-height:1.8">
          <li><b>50 puntos</b> → 5% de descuento en tu próxima compra</li>
          <li><b>120 puntos</b> → 10% de descuento</li>
          <li><b>250 puntos</b> → un producto de regalo</li>
          <li><b>450 puntos</b> → un producto premium gratis</li>
        </ul>
        <p>Ganás 1 punto por cada $1.000 gastados, y puntos extra en los productos que marcamos como novedad.</p>
        <p>Para sumar puntos, mostrá tu código QR en el local (lo encontrás en la pestaña "Mi cuenta" de la app), o simplemente pedí por WhatsApp con este mismo número de teléfono que usaste para registrarte.</p>
        <p>¡Te esperamos!</p>
      </div>
      <div style="background:#1A1410;color:#888;padding:14px 24px;font-size:11px;text-align:center">
        Casa NOA
      </div>
    </div>
  </body></html>`
}

async function enviarBienvenida(nombre, email) {
  if (!email) return
  try {
    // Mail de bienvenida al cliente
    await fetch(ENVIAR_EMAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Bienvenido a Casa NOA',
        html: htmlBienvenida(nombre),
      }),
    })
    // Notificación a Casa NOA
    await fetch(ENVIAR_EMAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@casanoa.com.ar',
        subject: 'Nuevo registro en Casa NOA',
        html: `<p>Se registró un nuevo cliente:</p><ul><li><b>Nombre:</b> ${nombre}</li><li><b>Email:</b> ${email}</li></ul>`,
      }),
    })
  } catch {
    // si el mail falla, no bloqueamos el registro
  }
}

const STORAGE_KEY = 'casanoa-tienda-telefono'

// Niveles del club: se recalculan cada mes según cuántas veces compró
// en el local en ESE mes (cualquier compra registrada por el personal cuenta como visita)
const NIVELES = [
  {
    nombre: 'Select', min: 0, envioGratis: false, premio: false,
    beneficios: ['Sumás 1 punto por cada $1.000 en compras', 'Código QR para identificarte en el local'],
  },
  {
    nombre: 'Signature', min: 4, envioGratis: false, premio: true,
    beneficios: ['Premio especial al llegar a 4 visitas en el mes'],
  },
  {
    nombre: 'Reserve', min: 12, envioGratis: true, premio: true,
    beneficios: ['Envío gratis con cualquier monto', 'Beneficios exclusivos Reserve'],
  },
]

function mesActualISO() {
  const ahora = new Date()
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`
}

function contarVisitasDelMes(historial) {
  const mes = mesActualISO()
  return (historial || []).filter((h) => (h.fecha || '').slice(0, 7) === mes).length
}

function calcularNivel(historial) {
  const visitas = contarVisitasDelMes(historial)
  let actual = NIVELES[0]
  for (const n of NIVELES) {
    if (visitas >= n.min) actual = n
  }
  const idx = NIVELES.indexOf(actual)
  const proximo = NIVELES[idx + 1] || null
  return { actual, proximo, visitas }
}

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
  const [fechaNacimientoForm, setFechaNacimientoForm] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [fechaNacimientoNueva, setFechaNacimientoNueva] = useState('')
  const [guardandoFecha, setGuardandoFecha] = useState(false)

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
        fechaNacimiento: fechaNacimientoForm || null,
        puntos: 0,
        fechaRegistro: new Date().toISOString(),
      }
      clientes[telefonoLimpio] = nuevoCliente
      await guardarClientes(clientes)
      enviarBienvenida(nuevoCliente.nombre, nuevoCliente.email)
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
            placeholder="Email"
            value={emailForm}
            onChange={(e) => setEmailForm(e.target.value)}
            required
          />
          <label className="label-fecha-nacimiento">
            Fecha de nacimiento (para tu regalo de cumpleaños)
            <input
              type="date"
              value={fechaNacimientoForm}
              onChange={(e) => setFechaNacimientoForm(e.target.value)}
            />
          </label>
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

  async function guardarFechaNacimiento() {
    if (!fechaNacimientoNueva) return
    setGuardandoFecha(true)
    try {
      const clientes = await leerClientes()
      clientes[cliente.telefono] = { ...clientes[cliente.telefono], fechaNacimiento: fechaNacimientoNueva }
      await guardarClientes(clientes)
      setCliente(clientes[cliente.telefono])
    } catch (e) {
      setError('No se pudo guardar: ' + e.message)
    }
    setGuardandoFecha(false)
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(cliente.telefono)}`
  const descuentoUsado = cliente.historial && cliente.historial.length > 0
  const { actual: nivel, proximo, visitas } = calcularNivel(cliente.historial)
  const visitasParaProximo = proximo ? proximo.min - visitas : 0
  const porcentajeProgreso = proximo
    ? Math.min(100, ((visitas - nivel.min) / (proximo.min - nivel.min)) * 100)
    : 100
  const nivelSlug = nivel.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const esMesDeCumple = cliente.fechaNacimiento &&
    new Date(cliente.fechaNacimiento + 'T00:00:00').getMonth() === new Date().getMonth()

  return (
    <div className="mi-cuenta">
      <div className={`tarjeta-club tarjeta-club--${nivelSlug}`}>
        <div className="tarjeta-club-header">
          <div className="tarjeta-club-logo">CASA<br />NOA</div>
        </div>
        <div className="tarjeta-club-titulo">
          CASA NOA <span className="tarjeta-club-titulo-club">CLUB</span>
        </div>
        <div className="tarjeta-club-linea" />
        <div className="tarjeta-club-info">
          <div>
            <div className="tarjeta-club-nombre">{cliente.nombre.toUpperCase()}</div>
            <div className="tarjeta-club-nivel">{nivel.nombre.toUpperCase()} MEMBER</div>
          </div>
          <img src={qrUrl} alt="Tu código" className="tarjeta-club-qr" />
        </div>
      </div>

      <div className="puntos-resumen">
        <span className="puntos-numero">{cliente.puntos.toLocaleString('es-AR')}</span>
        <span className="puntos-label">puntos</span>
      </div>

      <div className="visitas-resumen">
        <span className="visitas-numero">{visitas}</span>
        <span className="visitas-label">{visitas === 1 ? 'visita este mes' : 'visitas este mes'}</span>
      </div>
      <div className="puntos-barra-track">
        <div className="puntos-barra-fill" style={{ width: `${porcentajeProgreso}%` }} />
      </div>
      {proximo
        ? <p className="puntos-para-siguiente">Te faltan {visitasParaProximo} {visitasParaProximo === 1 ? 'visita' : 'visitas'} este mes para nivel {proximo.nombre}</p>
        : <p className="puntos-para-siguiente">¡Estás en el nivel máximo este mes!</p>}

      <p className="texto-inicio">
        Mostrá este código en el local para sumar puntos en tu compra.
      </p>

      <h3 className="beneficios-titulo">Tus beneficios {nivel.nombre}</h3>
      <div className="checklist-beneficios">
        {NIVELES.slice(0, NIVELES.indexOf(nivel) + 1).flatMap(n => n.beneficios).map((b, i) => (
          <div key={i} className="checklist-item">
            <span className="checklist-check">✓</span>
            <span>{b}</span>
          </div>
        ))}
        {!descuentoUsado && (
          <div className="checklist-item">
            <span className="checklist-check">✓</span>
            <span>15% OFF en tu primera compra</span>
          </div>
        )}
        {cliente.fechaNacimiento && (
          <div className="checklist-item">
            <span className="checklist-check">✓</span>
            <span>{esMesDeCumple ? '¡Es tu mes de cumpleaños! Pasá por el local' : 'Regalo en tu mes de cumpleaños'}</span>
          </div>
        )}
      </div>

      {!cliente.fechaNacimiento && (
        <div className="tarjeta-pedir-fecha">
          <span className="beneficio-club-icono">🎂</span>
          <div>
            <strong>Sumá tu cumpleaños</strong>
            <p>Para activar tu regalo del mes</p>
          </div>
          <input
            type="date"
            className="input-fecha-inline"
            value={fechaNacimientoNueva}
            onChange={(e) => setFechaNacimientoNueva(e.target.value)}
          />
          <button
            className="btn-guardar-fecha"
            onClick={guardarFechaNacimiento}
            disabled={!fechaNacimientoNueva || guardandoFecha}
          >
            {guardandoFecha ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}

      {NIVELES.slice(NIVELES.indexOf(nivel) + 1).length > 0 && (
        <>
          <h3 className="beneficios-titulo">Próximos niveles a desbloquear</h3>
          <div className="fila-niveles-bloqueados">
            {NIVELES.slice(NIVELES.indexOf(nivel) + 1).map((n) => {
              const slug = n.nombre.toLowerCase()
              return (
                <div key={n.nombre} className={`mini-tarjeta-nivel mini-tarjeta-nivel--${slug}`}>
                  <div className="mini-tarjeta-nivel-header">
                    <span>CASA NOA<br />{n.nombre.toUpperCase()} MEMBER</span>
                    <span className="mini-tarjeta-nivel-candado">🔒</span>
                  </div>
                  <div className="mini-tarjeta-nivel-nombre">{cliente.nombre.toUpperCase()}</div>
                  <p className="mini-tarjeta-nivel-requisito">{n.min} visitas en el mes</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      <button className="link-cerrar-sesion" onClick={cerrarSesion}>
        No soy yo / cerrar sesión
      </button>
    </div>
  )
}
