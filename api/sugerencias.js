// api/sugerencias.js
// Devuelve los términos/rubros más buscados por un cliente (por teléfono),
// para que el front los cruce contra el catálogo que ya tiene cargado.
// Usa las mismas variables de entorno que panel-clientes.js:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const telefono = req.query.telefono
  if (!telefono) return res.status(400).json({ error: 'Falta el parámetro telefono' })

  let SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '')
  if (!SUPABASE_URL.endsWith('/rest/v1')) SUPABASE_URL += '/rest/v1'
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    const url = `${SUPABASE_URL}/eventos_busqueda?telefono_cliente=eq.${encodeURIComponent(telefono)}&select=termino,creado_en&order=creado_en.desc&limit=50`
    const eventosRes = await fetch(url, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
    if (!eventosRes.ok) {
      const detalle = await eventosRes.text()
      throw new Error(`No se pudo leer búsquedas (status ${eventosRes.status}): ${detalle}`)
    }
    const eventos = await eventosRes.json()

    // Agrupar por término, contar frecuencia
    const conteo = {}
    for (const e of eventos) {
      conteo[e.termino] = (conteo[e.termino] || 0) + 1
    }
    const terminos = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([termino]) => termino)

    // Productos ya comprados antes por este cliente (para sugerir recompra)
    let recompra = []
    try {
      const pedidosUrl = `${SUPABASE_URL}/pedidos?telefono_cliente=eq.${encodeURIComponent(telefono)}&select=items`
      const pedidosRes = await fetch(pedidosUrl, {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      })
      if (pedidosRes.ok) {
        const pedidos = await pedidosRes.json()
        const conteoProductos = {}
        for (const pedido of pedidos) {
          for (const item of pedido.items || []) {
            conteoProductos[item.id] = (conteoProductos[item.id] || 0) + 1
          }
        }
        recompra = Object.entries(conteoProductos)
          .sort((a, b) => b[1] - a[1])
          .map(([id]) => id)
      }
    } catch {
      // si falla, seguimos solo con términos de búsqueda
    }

    res.status(200).json({ terminos, recompra })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
