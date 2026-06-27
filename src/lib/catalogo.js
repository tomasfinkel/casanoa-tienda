// Confirmado contra ~50 productos reales de productos.json:
//   - Cada producto tiene "codigo" (string, ej "11020") — 100% de los casos.
//   - "nombre" y "precio" existen siempre.
//   - "barcodes" es un array que en muchos productos viene vacío ([]). No es
//     confiable como única clave.
//   - No existe ningún campo de imagen. Las fotos van por afuera de DUX.
//
// catalogo-tienda.json puede identificar cada producto por "codigo" (el
// interno de DUX, confiable siempre) o por "barcode" (más cómodo si lo tenés
// a mano, pero no todos los productos lo tienen cargado).

import catalogoTienda from '../data/catalogo-tienda.json'

const CATALOGO_BLOB_URL =
  'https://sjczw9fimmonkf7t.public.blob.vercel-storage.com/productos.json'

export async function obtenerCatalogoTienda() {
  const productosRes = await fetch(CATALOGO_BLOB_URL)
  if (!productosRes.ok) throw new Error('No se pudo leer el cache de DUX')

  const productos = await productosRes.json()

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
        imagen: null, // confirmado: DUX no provee fotos, hay que cargarlas aparte
        categoria: item.categoria,
      }
    })
    .filter(Boolean)
}
