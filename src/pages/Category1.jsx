import { Link } from 'react-router-dom'

function Category1() {
  return (
    <div className="page">
      <h1>Category 1</h1>
      <p>This is a placeholder for Category 1 content.</p>
      <Link to="/">← Back to Candidates</Link>
    </div>
  )
}

export default Category1
