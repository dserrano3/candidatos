import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/', label: 'Resumen' },
  { path: '/category1', label: 'Escándalos' },
  { path: '/category2', label: 'Experiencia' },
  { path: '/category3', label: 'Educación' },
  { path: '/category4', label: 'Salud' },
  { path: '/category5', label: 'Seguridad' }
]

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Categorías</h2>
        <button
          className={`hamburger ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menú de navegación"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {isOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}

export default Navigation
