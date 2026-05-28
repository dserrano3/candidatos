import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, getEducacion } from '../utils/helpers'

const CANDIDATE_INFO = [
  { key: 'cepeda', name: 'Cepeda', image: '/cepeda.jpg' },
  { key: 'espriella', name: 'Espriella', image: '/espriella.jpg' },
  { key: 'valencia', name: 'Valencia', image: '/valencia.jpg' }
]

function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function Category3() {
  const [candidates, setCandidates] = useState({
    cepeda: { summary: 'Loading...', sources: [] },
    espriella: { summary: 'Loading...', sources: [] },
    valencia: { summary: 'Loading...', sources: [] }
  })

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getEducacion)
      setCandidates(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1>Educación</h1>
      <p>Resumen de las propuestas de educación de los candidatos.</p>

      <nav className="category-links">
        <h2>Categorías</h2>
        <ul>
          <li><Link to="/">Resumen</Link></li>
          <li><Link to="/category1">Escándalos</Link></li>
          <li><Link to="/category2">Experiencia</Link></li>
          <li><Link to="/category3">Educación</Link></li>
          <li><Link to="/category4">Salud</Link></li>
          <li><Link to="/category5">Seguridad</Link></li>
        </ul>
      </nav>

      <div id="general-info">
        {shuffledCandidates.map((candidate) => (
          <div key={candidate.key} id={candidate.key} className="candidate-card">
            <div className="candidate-photo">
              <img src={candidate.image} alt={candidate.name} />
            </div>
            <div className="candidate-text">
              <h3>{candidate.name}</h3>
              <ReactMarkdown>{candidates[candidate.key].summary}</ReactMarkdown>
              {candidates[candidate.key].sources.length > 0 && (
                <div className="sources">
                  <div className="sources-title">Sources</div>
                  <ul className="sources-list">
                    {candidates[candidate.key].sources.map((source, idx) => (
                      <li key={idx}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category3
