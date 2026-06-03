import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiLightbulbFlashFill, RiArrowDownSLine } from '@remixicon/react'

const ELECTION_DATE = new Date('2026-06-21T00:00:00')

function getTimeLeft() {
  const diff = ELECTION_DATE - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const TOP_ITEMS = [
  { path: '/', label: 'Resumen' },
  { path: '/category1', label: 'Escándalos' },
  { path: '/category2', label: 'Experiencia' },
  { path: '/category7', label: 'Vicepresidente' },
  { path: '/category8', label: 'Noticias' },
  { path: '/category9', label: 'Apoyo' },
  { path: '/category10', label: 'Ministros' },
]

const PROPUESTAS_ITEMS = [
  { path: '/category3', label: 'Educación' },
  { path: '/category4', label: 'Salud' },
  { path: '/category5', label: 'Seguridad' },
  { path: '/category6', label: 'Energía' },
]

const activeClass = 'bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] shadow-[0_2px_8px_rgba(26,26,46,0.3)]'
const inactiveClass = 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)] hover:from-emerald-600 hover:to-emerald-700'

function Navigation({ onInfoClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const [propuestasOpen, setPropuestasOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPropuestasOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => {
    setIsOpen(false)
    setPropuestasOpen(false)
  }

  const isPropuestasActive = PROPUESTAS_ITEMS.some(item => item.path === location.pathname)

  return (
    <nav className="my-10 relative max-md:my-6">
      <div className="flex justify-between items-start mb-5 max-md:mb-0">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-[#1a1a2e] text-[2.4rem] max-md:text-[1.6rem] font-bold leading-[1.15] tracking-tight m-0">
              Decide Tu Voto
            </h2>
            {onInfoClick && (
              <button
                className="bg-transparent border-none cursor-pointer text-emerald-500 p-0 flex items-center shrink-0 transition-[color,transform] duration-200 hover:text-emerald-600 hover:scale-125"
                onClick={onInfoClick}
                aria-label="Más información"
              >
                <RiLightbulbFlashFill size={22} />
              </button>
            )}
          </div>
          {location.pathname === '/' && timeLeft && (
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-emerald-600 text-[1rem] font-semibold tracking-tight">
                Segunda vuelta
              </span>
              <span className="text-gray-300 text-sm">·</span>
              <span className="font-mono text-[0.85rem] text-gray-500 tabular-nums">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          )}
          <p className="text-gray-400 text-[0.8rem] font-medium uppercase tracking-wide m-0">
            Elecciones presidenciales Colombia 2026
          </p>
          <p className="text-gray-500 text-[0.85rem] m-0">
            Conoce a los candidatos, entiende sus propuestas y decide tu voto con confianza — todo en menos de 20 minutos.
          </p>
        </div>

        {/* Hamburger — hidden on desktop, visible on mobile */}
        <button
          className={`hidden max-md:flex w-6 h-5 bg-transparent border-none cursor-pointer p-0 z-[1001] shrink-0 ${isOpen ? 'fixed top-6 right-5' : 'relative ml-4'}`}
          onClick={toggleMenu}
          aria-label="Menú de navegación"
        >
          <span className={`absolute inset-x-0 h-[2px] bg-[#1a1a2e] rounded-full transition-all duration-300 ${isOpen ? 'top-[9px] rotate-45' : 'top-0'}`} />
          <span className={`absolute inset-x-0 h-[2px] bg-[#1a1a2e] rounded-full top-[9px] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`absolute inset-x-0 h-[2px] bg-[#1a1a2e] rounded-full transition-all duration-300 ${isOpen ? 'top-[9px] -rotate-45' : 'top-[18px]'}`} />
        </button>
      </div>

      <ul
        className={[
          'flex gap-3 flex-wrap justify-center list-none p-0 m-0',
          'max-md:fixed max-md:top-0 max-md:right-0 max-md:h-screen',
          'max-md:w-[280px] max-[480px]:w-full',
          'max-md:bg-white max-md:flex-col max-md:justify-start max-md:items-stretch',
          'max-md:pt-20 max-md:px-5 max-md:pb-5 max-md:gap-2',
          'max-md:shadow-[-4px_0_20px_rgba(0,0,0,0.15)]',
          'max-md:transition-transform max-md:duration-300 max-md:ease-in-out',
          'max-md:z-[1000] max-md:overflow-y-auto',
          isOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full',
        ].join(' ')}
      >
        {/* Top-level items */}
        {TOP_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={closeMenu}
                className={[
                  'block py-3.5 px-7 text-white no-underline rounded-xl font-medium text-[0.95rem]',
                  'transition-all duration-300',
                  'max-md:py-4 max-md:px-5 max-md:text-base max-md:rounded-lg',
                  'min-h-[48px] flex items-center justify-center max-md:justify-start',
                  isActive ? activeClass : inactiveClass,
                ].join(' ')}
              >
                {item.label}
              </Link>
            </li>
          )
        })}

        {/* Propuestas dropdown */}
        <li className="relative" ref={dropdownRef}>
          {/* Desktop: button + floating panel */}
          <div className="max-md:hidden">
            <button
              onClick={() => setPropuestasOpen(!propuestasOpen)}
              className={[
                'py-3.5 px-7 text-white rounded-xl font-medium text-[0.95rem]',
                'transition-all duration-300 cursor-pointer border-none',
                'min-h-[48px] flex items-center justify-center gap-1',
                isPropuestasActive || propuestasOpen ? activeClass : inactiveClass,
              ].join(' ')}
            >
              Propuestas
              <RiArrowDownSLine size={16} className={`transition-transform duration-200 ${propuestasOpen ? 'rotate-180' : ''}`} />
            </button>

            {propuestasOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[160px]">
                {PROPUESTAS_ITEMS.map(item => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setPropuestasOpen(false)}
                      className={[
                        'block px-5 py-3 text-[0.9rem] font-medium no-underline transition-colors duration-200',
                        isActive
                          ? 'bg-[#1a1a2e] text-white'
                          : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mobile: accordion inside slide-out */}
          <div className="md:hidden flex flex-col gap-1">
            <button
              onClick={() => setPropuestasOpen(!propuestasOpen)}
              className={[
                'w-full py-4 px-5 text-white rounded-lg font-medium text-base',
                'transition-all duration-300 cursor-pointer border-none',
                'min-h-[48px] flex items-center justify-between',
                isPropuestasActive || propuestasOpen ? activeClass : inactiveClass,
              ].join(' ')}
            >
              Propuestas
              <RiArrowDownSLine size={18} className={`transition-transform duration-200 ${propuestasOpen ? 'rotate-180' : ''}`} />
            </button>

            {propuestasOpen && (
              <div className="ml-4 flex flex-col gap-1">
                {PROPUESTAS_ITEMS.map(item => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenu}
                      className={[
                        'block py-3 px-5 text-white no-underline rounded-lg font-medium text-base',
                        'transition-all duration-300 min-h-[48px] flex items-center',
                        isActive ? activeClass : inactiveClass,
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </li>
      </ul>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999]"
          onClick={closeMenu}
        />
      )}
    </nav>
  )
}

export default Navigation
