import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, fetchAndSaveAllCandidates, getCandidate, saveCandidate } from '../utils/helpers'
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
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState({
    cepeda: { summary: 'Loading...', sources: [] },
    espriella: { summary: 'Loading...', sources: [] },
    valencia: { summary: 'Loading...', sources: [] }
  })

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getCandidate)
      setCandidates(data)
    }
    load()
  }, [])

  const handleGeminiQuery = async () => {
    setLoading(true)
    setResponse('')
    try {
      await fetchAndSaveAllCandidates(0, saveCandidate)
      // Reload data after saving
      const data = await loadAllCandidates(getCandidate)
      setCandidates(data)
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Candidatos Presidenciales</h1>
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
      </header>

      <div className="gemini-section">
        <button onClick={handleGeminiQuery} disabled={loading}>
          {loading ? 'Loading...' : 'Ask Gemini'}
        </button>
        {response && (
          <div className="gemini-response">
            <h3>Response:</h3>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>

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

export default Candidates
