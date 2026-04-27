import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, fetchAndSaveAllCandidates, getExperiencia, saveExperiencia } from '../utils/helpers'

function Category2() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState({
    cepeda: 'Loading...',
    espriella: 'Loading...',
    valencia: 'Loading...'
  })

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
        <div id="cepeda" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Cepeda</h3>
            <ReactMarkdown>{candidates.cepeda}</ReactMarkdown>
          </div>
        </div>

        <div id="espriella" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Espriella</h3>
            <ReactMarkdown>{candidates.espriella}</ReactMarkdown>
          </div>
        </div>

        <div id="valencia" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Valencia</h3>
            <ReactMarkdown>{candidates.valencia}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category2
