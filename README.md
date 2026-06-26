# Casa NOA — Tienda online

Proyecto nuevo, separado de casanoa-pedidos. Arranca con catálogo + carrito,
sin checkout todavía.

## Cómo correrlo

```
npm install
npm run dev
```

## Qué hace cada cosa

- `src/data/catalogo-tienda.json` — la lista de productos que vendés online.
  Tiene placeholders ("0001", "0002"...). Hay que reemplazarlos por los IDs
  reales de los 25-30 productos curados. Si algo se agota, cambiás
  `disponible` a `false` y volvés a deployar.

- `src/lib/catalogo.js` — junta esa lista con el precio real, que saca del
  mismo archivo (`productos.json`) que ya usa el lector de precios por QR.
  No vuelve a consultar DUX desde cero.

  **Atención**: los nombres de campo `nombre`, `precio`, `imagen` que usa
  este archivo son un supuesto mío. Hay que confirmarlos contra la
  estructura real de `productos.json` antes de que esto funcione de verdad.

- `src/context/CartContext.jsx` — el carrito. Guarda solo el ID y la
  cantidad de cada producto, y lo persiste en el navegador (localStorage)
  para que no se pierda si recargás la página.

- `src/context/CatalogContext.jsx` — carga el catálogo una sola vez y lo
  comparte entre la lista de productos y el carrito, para no duplicar el
  fetch.

- `src/components/` — la lista de productos, la tarjeta de cada producto y
  el panel del carrito.

- `api/precio-checkout.js` — vacío a propósito. Es donde más adelante,
  cuando lleguemos a Mercado Pago, va a vivir el chequeo de precio real
  justo antes de cobrar.

## Lo que falta para que esto sea usable

1. Reemplazar los IDs placeholder de `catalogo-tienda.json` por los 25-30
   reales.
2. Confirmar los nombres de campo reales en `productos.json` y ajustar
   `catalogo.js`.
3. Subir fotos de producto (hoy `imagen` puede venir vacía sin romper nada).
4. El layout sigue siendo funcional, no el diseño final — falta el pase de
   tipografía (sans extra-bold + serif itálica) y el elemento que comunique
   curaduría ("30 productos, elegidos uno por uno"). Esa es una conversación
   aparte.

## Marca real ya integrada

- `public/casa-noa-logo.png` — el wordmark oficial, usado en el header.
- `public/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`,
  `icon-512.png` — derivados de la "C" del logo real (no inventados),
  para la pestaña del navegador y para cuando esto se instale como app.
- `public/c-mark-transparent.png` — la "C" sola, sin fondo, para usar como
  marca de agua o loader.
- Paleta real en `index.css`: fondo `#e7e3db` (crema, sampleado del feed),
  texto y acentos `#3c2c23` (marrón exacto del logo, no aproximado).

