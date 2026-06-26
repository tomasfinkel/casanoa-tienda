// TODO: implementar cuando lleguemos a la fase de checkout con Mercado Pago.
// Esta función va a recibir los IDs del carrito y consultar el precio
// real en DUX justo antes de confirmar el pago, en vez de confiar en el
// cache de 12hs que se usa para navegar el catálogo.

export default async function handler(req, res) {
  res.status(501).json({ error: 'Todavía no implementado' })
}
