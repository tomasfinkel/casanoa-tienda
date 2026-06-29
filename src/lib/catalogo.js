// Catálogo completo: son TODOS los productos de DUX.
//
// El stock ahora sí existe (stock.json, sincronizado una vez por día desde
// casanoa-pedidos), pero puede no estar disponible todavía la primera vez
// que esto se despliegue, o si la sincronización de un día se cortó a
// la mitad. Por eso el filtro de stock se aplica más abajo (en
// ProductList), "fallando abierto": si no hay dato de stock para un
// producto, se sigue mostrando — no se oculta por las dudas.

const CATALOGO_BLOB_URL =
  'https://sjczw9fimmonkf7t.public.blob.vercel-storage.com/productos.json'

// [Probable] Mismo Blob store que productos.json, mismo patrón de nombre.
// No confirmado todavía con una sincronización real corrida — si falla,
// avisar para ajustar la URL.
const STOCK_BLOB_URL =
  'https://sjczw9fimmonkf7t.public.blob.vercel-storage.com/stock.json'

function extraerListaProductos(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.productos)) return data.productos
  if (data && Array.isArray(data.items)) return data.items
  if (data && Array.isArray(data.data)) return data.data
  throw new Error(
    'productos.json no tiene un array reconocible. Claves recibidas: ' +
      Object.keys(data ?? {}).join(', '),
  )
}

async function obtenerStockPorCodigo() {
  try {
    const res = await fetch(STOCK_BLOB_URL)
    if (!res.ok) return {}
    const data = await res.json()
    return data?.stock ?? {}
  } catch {
    // Todavía no corrió ninguna sincronización de stock, o falló.
    // No es un error fatal: el catálogo se muestra igual, sin filtrar.
    return {}
  }
}

// Qué sucursales ya tienen al menos un producto sincronizado hoy.
// Sirve para distinguir "este producto no tiene stock acá" (la sucursal
// ya sincronizó, y no apareció) de "todavía no sé" (la sucursal ni
// empezó su sincronización de hoy).
function calcularSucursalesConDatos(stockPorCodigo) {
  const sucursales = new Set()
  for (const datosProducto of Object.values(stockPorCodigo)) {
    for (const sucursalId of Object.keys(datosProducto)) {
      sucursales.add(sucursalId)
    }
  }
  return sucursales
}

export async function obtenerCatalogoCompleto() {
  const [resProductos, stockPorCodigo] = await Promise.all([
    fetch(CATALOGO_BLOB_URL),
    obtenerStockPorCodigo(),
  ])
  if (!resProductos.ok) throw new Error('No se pudo leer el cache de DUX')

  const raw = await resProductos.json()
  const productos = extraerListaProductos(raw)
  const sucursalesConDatos = calcularSucursalesConDatos(stockPorCodigo)

  const resultado = productos.map((p) => ({
    id: p.codigo,
    nombre: p.nombre,
    precio: p.precio,
    imagen: `/productos/${p.codigo}.jpg`,
    stock: stockPorCodigo[p.codigo] ?? null,
  }))

  // Propiedad extra sobre el array (no un índice), para que ProductList
  // sepa qué sucursales ya tienen datos confiables hoy.
  resultado.sucursalesConDatos = sucursalesConDatos
  return resultado
}
