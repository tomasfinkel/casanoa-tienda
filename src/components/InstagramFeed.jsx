import { useState } from 'react'
import config from '../data/instagram.json'

function FotoInstagram({ archivo }) {
  const [rota, setRota] = useState(false)
  if (rota) return null
  return (
    <img
      className="foto-instagram"
      src={`/instagram/${archivo}`}
      alt="Casa NOA en Instagram"
      onError={() => setRota(true)}
    />
  )
}

export default function InstagramFeed() {
  const url = `https://instagram.com/${config.usuario.replace('@', '')}`

  return (
    <section className="seccion-instagram">
      <h2>Mirá lo último</h2>
      {config.fotos.length > 0 && (
        <div className="fila-instagram">
          {config.fotos.map((archivo) => (
            <a href={url} target="_blank" rel="noreferrer" key={archivo}>
              <FotoInstagram archivo={archivo} />
            </a>
          ))}
        </div>
      )}
      <a href={url} target="_blank" rel="noreferrer" className="link-instagram">
        Seguinos en Instagram @{config.usuario.replace('@', '')}
      </a>
    </section>
  )
}
