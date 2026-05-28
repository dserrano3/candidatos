import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { RiGithubFill, RiArrowDownSLine } from '@remixicon/react'
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
  const [headerExpanded, setHeaderExpanded] = useState(false)
  const [showPopup, setShowPopup] = useState(() => !localStorage.getItem('elecciones_visited'))

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getCandidate)
      setCandidates(data)
    }
    load()
  }, [])

  const closePopup = () => {
    localStorage.setItem('elecciones_visited', 'true')
    setShowPopup(false)
  }

  return (
    <div className="page">
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup} aria-label="Cerrar">✕</button>
            <h1>Elecciones Colombia AI</h1>
            <p>¿No sabes por quién votar?</p>
            <p>Esta página te resume la historia y propuestas de cada candidato usando IA — sin editoriales, sin sesgo político.</p>
            <p>En menos de 20 minutos tienes todo lo que necesitas para decidir con información, no con rumores.</p>
            <p>El orden es al azar, la info se actualiza cada 24 horas y las preguntas son las mismas para todos.</p>
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
                <RiGithubFill size={20} style={{verticalAlign: 'middle'}} />
              </a>
            </p>
            <p>No hay financiación externa, todo es pagado por mí.</p>
            <button className="popup-cta" onClick={closePopup}>¡Entendido, empezar!</button>
          </div>
        </div>
      )}
      <header className="page-header">
        <button
          className="page-header-toggle"
          onClick={() => setHeaderExpanded(prev => !prev)}
          aria-expanded={headerExpanded}
        >
          <span>Acerca de esta página</span>
          <RiArrowDownSLine
            size={20}
            className={`page-header-chevron${headerExpanded ? ' expanded' : ''}`}
          />
        </button>
        <div className={`page-header-content${headerExpanded ? ' open' : ''}`}>
          <h1>Elecciones Colombia AI</h1>
          <p>¿No sabes por quién votar?</p>
          <p>Esta página te resume la historia y propuestas de cada candidato usando IA — sin editoriales, sin sesgo político.</p>
          <p>En menos de 20 minutos tienes todo lo que necesitas para decidir con información, no con rumores.</p>
          <p>El orden es al azar, la info se actualiza cada 24 horas y las preguntas son las mismas para todos.</p>
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
              <RiGithubFill size={20} style={{verticalAlign: 'middle'}} />
            </a>
          </p>
          <p>No hay financiación externa, todo es pagado por mí.</p>
        </div>
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
