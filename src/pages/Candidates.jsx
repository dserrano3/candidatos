import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, getCandidate } from '../utils/helpers'
import Navigation from '../components/Navigation'
import queries from '../utils/queries.json'

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

function Candidates() {
  const [candidates, setCandidates] = useState({
    cepeda: { summary: 'Cargando...', sources: [] },
    espriella: { summary: 'Cargando...', sources: [] },
    valencia: { summary: 'Cargando...', sources: [] }
  })

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getCandidate)
      setCandidates(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Elecciones Colombia AI</h1><br></br>
        <p>Encontrar por quién votar no es fácil, esta herramienta va a ayudarte a entender las principales propuestas e historia de los candidatos.</p>
        <p>Las noticias tienen un sesgo, esta página encuentra información a base de AI y la agrupa para que decidas en menos de 20 minutos por quién votar.</p>
        <p>No hay editorial, el orden es al azar y cada 24 horas se actualiza con nueva información.</p>
        <p>Esta es una página que hace las mismas preguntas a un sistema de AI para cada uno de los candidatos.</p>
        <p>Para reducir el sesgo, cada día el sistema le hará las preguntas al AI y actualizará la información.</p>
        <p>Los candidatos están organizados de forma aleatoria en cada página para evitar sesgo.</p>
        <div className="questions-section">
          <h3>Preguntas que se le hacen al AI:</h3>
          <ul className="questions-list">
            {queries.general.map((question, idx) => (
              <li key={idx}>{question.replace('<candidato>', '[candidato]')}</li>
            ))}
          </ul>
        </div>
        <p className="github-link">
          Este proyecto es transparente, acá está el código que está siendo ejecutado{' '}
          <a href="https://github.com/dserrano3/candidatos" target="_blank" rel="noopener noreferrer">
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" style={{verticalAlign: 'middle'}}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </p>
        <p>No hay financiación externa, todo es pagado por mí.</p>
      </header>

      <Navigation />

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
                  <div className="sources-title">Fuentes</div>
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

export default Candidates
