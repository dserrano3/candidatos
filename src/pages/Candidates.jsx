import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { loadAllCandidates, fetchAndSaveAllCandidates, getCandidate, saveCandidate } from '../utils/helpers'

function Candidates() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState({
    cepeda: 'Loading...',
    espriella: 'Loading...',
    valencia: 'Loading...'
  })

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
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>Candidates</h1>
      <p>Welcome to the Candidates page. This is the main landing page.</p>

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
        <h2>Categories</h2>
        <ul>
          <li><Link to="/category1">Escandalos</Link></li>
          <li><Link to="/category2">Experiencia</Link></li>
          <li><Link to="/category3">Category 3</Link></li>
          <li><Link to="/category4">Category 4</Link></li>
        </ul>
      </nav>

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

export default Candidates
