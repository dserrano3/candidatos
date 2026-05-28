import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, fetchAndSaveAllCandidates, getExperiencia, saveExperiencia } from '../utils/helpers'

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

function Category2() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState({
    cepeda: 'Loading...',
    espriella: 'Loading...',
    valencia: 'Loading...'
  })

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getExperiencia)
      setCandidates(data)
    }
    load()
  }, [])

  const handleGeminiQuery = async () => {
    setLoading(true)
    setResponse('')
    try {
      await fetchAndSaveAllCandidates(2, saveExperiencia)
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>Experiencia</h1>
      <p>Resumen de la experiencia politica de los candidatos.</p>

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

      <Link to="/">← Back to Candidates</Link>

      <div id="general-info">
        {shuffledCandidates.map((candidate) => (
          <div key={candidate.key} id={candidate.key} className="candidate-card">
            <div className="candidate-photo">
              <img src={candidate.image} alt={candidate.name} />
            </div>
            <div className="candidate-text">
              <h3>{candidate.name}</h3>
              <ReactMarkdown>{candidates[candidate.key]}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category2
