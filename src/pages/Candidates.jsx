import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sendGeneralQuery, saveCandidate, getCandidate } from '../utils/helpers'

function Candidates() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [petroText, setPetroText] = useState('Loading...')

  useEffect(() => {
    const loadPetro = async () => {
      const summary = await getCandidate('Petro')
      setPetroText(summary || 'No data available')
    }
    loadPetro()
  }, [])

  const handleGeminiQuery = async () => {
    setLoading(true)
    setResponse('')
    try {
      const result = await sendGeneralQuery(0)
      await saveCandidate('Petro', result)
      setResponse(result)
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
            <p>{response}</p>
          </div>
        )}
      </div>

      <nav className="category-links">
        <h2>Categories</h2>
        <ul>
          <li><Link to="/category1">Category 1</Link></li>
          <li><Link to="/category2">Category 2</Link></li>
          <li><Link to="/category3">Category 3</Link></li>
          <li><Link to="/category4">Category 4</Link></li>
        </ul>
      </nav>

      <div id="general-info">
        <div id="petro" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Petro</h3>
            <p>{petroText}</p>
          </div>
        </div>

        <div id="valencia" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Valencia</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>
        </div>

        <div id="cepeda" className="candidate-card">
          <div className="candidate-photo"></div>
          <div className="candidate-text">
            <h3>Cepeda</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Candidates
