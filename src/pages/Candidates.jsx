import { Link } from 'react-router-dom'

function Candidates() {
  return (
    <div className="page">
      <h1>Candidates</h1>
      <p>Welcome to the Candidates page. This is the main landing page.</p>

      <nav className="category-links">
        <h2>Categories</h2>
        <ul>
          <li><Link to="/category1">Category 1</Link></li>
          <li><Link to="/category2">Category 2</Link></li>
          <li><Link to="/category3">Category 3</Link></li>
          <li><Link to="/category4">Category 4</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Candidates
