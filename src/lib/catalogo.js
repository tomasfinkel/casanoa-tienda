// Confirmado contra ~50 productos reales de productos.json:
//   - Cada producto tiene "codigo" (string, ej "11020") — 100% de los casos.
//   - "nombre" y "precio" existen siempre.
//   - "barcodes" es un array que en muchos productos viene vacío ([]). No es
//     confiable como única clave.
//   - No existe ningún campo de imagen. Las fotos van por afuera de DUX.
//
// Lo que NO está confirmado: si productos.json es un array directo, o un
// objeto que tiene el array adentro (ej: {"productos": [...]}). Por eso
// extraerListaProductos prueba varias formas en vez de asumir una sola.

import catalogoTienda from '../data/catalogo-tienda.json'

const CATALOGO_BLOB_URL =
  'https://sjczw9fimmonkf7t.public.blob.vercel-storage.com/productos.json'

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

export async function obtenerCatalogoTienda() {
  const productosRes = await fetch(CATALOGO_BLOB_URL)
  if (!productosRes.ok) throw new Error('No se pudo leer el cache de DUX')

  const productosRaw = await productosRes.json()
  const productos = extraerListaProductos(productosRaw)

  const productosPorCodigo = {}
  const productosPorBarcode = {}
  for (const p of productos) {
    productosPorCodigo[p.codigo] = p
    for (const codigo of p.barcodes ?? []) {
      productosPorBarcode[codigo] = p
    }
  }

  return catalogoTienda
    .filter((item) => item.disponible)
    .sort((a, b) => a.orden - b.orden)
    .map((item) => {
      const prod = item.codigo
        ? productosPorCodigo[item.codigo]
        : productosPorBarcode[item.barcode]

      if (!prod) {
        console.warn(`Producto curado (${item.codigo ?? item.barcode}) no aparece en el cache de DUX`)
        return null
      }
      return {
        id: item.codigo ?? item.barcode,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen: null,
        categoria: item.categoria,
      }
    })
    .filter(Boolean)
}
