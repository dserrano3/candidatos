import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiLightbulbFlashFill } from '@remixicon/react'

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

const NAV_ITEMS = [
  { path: '/', label: 'Resumen' },
  { path: '/category1', label: 'Escándalos' },
  { path: '/category2', label: 'Experiencia' },
  { path: '/category3', label: 'Educación' },
  { path: '/category4', label: 'Salud' },
  { path: '/category5', label: 'Seguridad' },
  { path: '/category6', label: 'Energía' }
]

function Navigation({ onInfoClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const location = useLocation()

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

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
          className="hidden max-md:flex relative w-6 h-5 bg-transparent border-none cursor-pointer p-0 z-[1001] shrink-0 ml-4"
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
        {NAV_ITEMS.map((item) => {
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
                  isActive
                    ? 'bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] shadow-[0_2px_8px_rgba(26,26,46,0.3)]'
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)] hover:from-emerald-600 hover:to-emerald-700',
                ].join(' ')}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
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
