// IMPORTANTE: los nombres de campo (nombre, precio, imagen) abajo son un
// supuesto. Hay que confirmarlos contra la estructura real de productos.json
// antes de que esto funcione. Si DUX usa otros nombres (ej: descripcion,
// precioVenta, urlImagen), hay que ajustar acá nomás.

import catalogoTienda from '../data/catalogo-tienda.json'

const CATALOGO_BLOB_URL =
  'https://sjczw9fimmonkf7t.public.blob.vercel-storage.com/productos.json'

export async function obtenerCatalogoTienda() {
  const productosRes = await fetch(CATALOGO_BLOB_URL)
  if (!productosRes.ok) throw new Error('No se pudo leer el cache de DUX')
  const productos = await productosRes.json()

  const productosPorId = {}
  for (const p of productos) {
    productosPorId[p.id] = p
  }

  return catalogoTienda
    .filter((item) => item.disponible)
    .sort((a, b) => a.orden - b.orden)
    .map((item) => {
      const prod = productosPorId[item.id]
      if (!prod) {
        console.warn(`Producto curado ${item.id} no aparece en el cache de DUX`)
        return null
      }
      return {
        id: item.id,
        nombre: prod.nombre, // AJUSTAR si el campo real se llama distinto
        precio: prod.precio, // AJUSTAR si el campo real se llama distinto
        imagen: prod.imagen ?? null, // AJUSTAR si el campo real se llama distinto
        categoria: item.categoria,
      }
    })
    .filter(Boolean)
}
