import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { RiGithubFill, RiArrowDownSLine } from '@remixicon/react'
import { loadAllCandidates, getCandidate } from '../utils/helpers'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import queries from '../utils/queries.json'

const CANDIDATE_INFO = [
  { key: 'cepeda', name: 'Cepeda', image: '/cepeda.jpg' },
  { key: 'espriella', name: 'Espriella', image: '/espriella.jpg' },
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
  const [candidates, setCandidates] = useState({
    cepeda: { summary: 'Cargando...', sources: [] },
    espriella: { summary: 'Cargando...', sources: [] },
  })
  const [showPopup, setShowPopup] = useState(() => !localStorage.getItem('elecciones_visited'))
  const [isClosing, setIsClosing] = useState(false)
  const [collapsed, setCollapsed] = useState(() => Object.fromEntries(CANDIDATE_INFO.map(c => [c.key, true])))

  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getCandidate)
      setCandidates(data)
    }
    load()
  }, [])

  const closePopup = () => {
    setIsClosing(true)
    setTimeout(() => {
      localStorage.setItem('elecciones_visited', 'true')
      setShowPopup(false)
      setIsClosing(false)
    }, 200)
  }

  const openPopup = () => {
    setIsClosing(false)
    setShowPopup(true)
  }

  return (
    <div className="p-[30px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-[900px]:p-6 max-md:p-5 max-md:rounded-xl max-[480px]:p-4 max-[480px]:rounded-[10px]">
      {showPopup && (
        <div
          className={`fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-[2px] ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}
          onClick={closePopup}
        >
          <div
            className={`bg-white rounded-2xl py-9 px-8 pb-7 max-w-[560px] w-full max-h-[90vh] overflow-y-auto relative text-left shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col gap-3 max-[480px]:py-7 max-[480px]:px-5 max-[480px]:pb-6 ${isClosing ? 'animate-modal-pop-out' : 'animate-modal-pop'}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3.5 right-4 bg-transparent border-none text-[1.1rem] cursor-pointer text-gray-500 leading-none py-1 px-2 rounded-md transition-[background,color] duration-150 hover:bg-gray-100 hover:text-gray-900"
              onClick={closePopup}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <h1 className="text-2xl text-[#1a1a2e] m-0 mb-1 text-left max-[480px]:text-xl">
              Elecciones Colombia AI
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed m-0 text-left">¿No sabes por quién votar?</p>
            <p className="text-sm text-gray-700 leading-relaxed m-0 text-left">Esta página te resume la historia y propuestas de cada candidato usando IA — sin editoriales, sin sesgo político.</p>
            <p className="text-sm text-gray-700 leading-relaxed m-0 text-left">En menos de 20 minutos tienes todo lo que necesitas para decidir con información, no con rumores.</p>
            <p className="text-sm text-gray-700 leading-relaxed m-0 text-left">El orden es al azar, la info se actualiza cada 24 horas y las preguntas son las mismas para todos.</p>
            <div className="mt-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[10px] border border-slate-200 text-left max-md:mt-5 max-md:p-4">
              <h3 className="text-[#1a1a2e] text-base font-semibold mt-0 mb-3 max-md:text-sm">
                Preguntas que se le hacen a la IA:
              </h3>
              <ul className="list-none p-0 m-0">
                {queries.general.map((question, idx) => (
                  <li
                    key={idx}
                    className="relative pl-5 mb-2.5 text-gray-600 text-sm leading-relaxed last:mb-0 before:content-['•'] before:absolute before:left-0 before:text-emerald-500 before:font-bold max-md:text-[0.85rem] max-md:pl-4"
                  >
                    {question.replace('<candidato>', '[candidato]')}
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex items-center justify-center gap-2 mt-4 p-3 bg-slate-50 rounded-lg text-sm text-left max-md:flex-col max-md:text-center max-md:p-2.5">
              Este proyecto es transparente, acá está el código que está siendo ejecutado{' '}
              <a
                href="https://github.com/dserrano3/candidatos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-[#1a1a2e] transition-colors duration-200 no-underline hover:text-emerald-500"
              >
                <RiGithubFill size={20} style={{ verticalAlign: 'middle' }} />
              </a>
            </p>
            <p className="text-sm text-gray-700 leading-relaxed m-0 text-left">No hay financiación externa, todo es pagado por un colombiano sin relacion a la politica.</p>
            <button
              className="mt-2 bg-[#1a1a2e] text-white border-none rounded-xl py-3.5 px-6 text-base font-semibold cursor-pointer w-full transition-colors duration-200 hover:bg-[#16213e]"
              onClick={closePopup}
            >
              ¡Entendido, empezar!
            </button>
          </div>
        </div>
      )}

      <Navigation onInfoClick={openPopup} />

      <div className="mt-10 flex flex-col gap-6 max-md:mt-6 max-md:gap-4">
        {shuffledCandidates.filter(c => candidates[c.key] !== null).map((candidate) => (
          <div
            key={candidate.key}
            id={candidate.key}
            onClick={() => collapsed[candidate.key] && setCollapsed(prev => ({ ...prev, [candidate.key]: false }))}
            className={`flex gap-6 p-6 bg-gradient-to-br from-white to-slate-50 rounded-[14px] border border-slate-200 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 max-[900px]:gap-5 max-[900px]:p-5 max-md:flex-col max-md:items-center max-md:text-center max-md:gap-4 max-md:p-5 max-[480px]:p-4 ${collapsed[candidate.key] ? 'cursor-pointer' : ''}`}
          >
            <div className="w-[100px] h-[100px] bg-gradient-to-br from-slate-200 to-slate-300 rounded-full shrink-0 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-[3px] border-white max-[900px]:w-20 max-[900px]:h-20 max-md:w-[90px] max-md:h-[90px] max-[480px]:w-20 max-[480px]:h-20">
              <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between max-md:justify-center max-md:gap-2">
                <h3 className="mt-0 mb-0 text-[#1a1a2e] text-xl font-semibold max-md:text-[1.15rem] max-[480px]:text-[1.1rem]">
                  {candidate.name}
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); setCollapsed(prev => ({ ...prev, [candidate.key]: !prev[candidate.key] })) }}
                  className="ml-2 max-md:ml-0 shrink-0 p-1 text-gray-400 hover:text-[#1a1a2e] transition-colors duration-200"
                  aria-label={collapsed[candidate.key] ? 'Expandir' : 'Colapsar'}
                >
                  <RiArrowDownSLine size={20} className={`transition-transform duration-300 ${collapsed[candidate.key] ? '-rotate-90' : ''}`} />
                </button>
              </div>
              {!collapsed[candidate.key] && (
                <div className="mt-3">
                  <div className="prose prose-sm max-w-none prose-headings:text-[#1a1a2e] prose-p:text-gray-600 prose-p:leading-[1.7] prose-li:text-gray-600 prose-strong:text-[#1a1a2e] prose-em:text-gray-500 prose-a:text-emerald-500 max-md:text-left">
                    <ReactMarkdown>{candidates[candidate.key].summary}</ReactMarkdown>
                  </div>
                  {candidates[candidate.key].sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="text-[0.8rem] font-semibold text-gray-500 mb-2 uppercase tracking-[0.5px]">
                        Fuentes
                      </div>
                      <ul className="flex flex-wrap gap-2 list-none p-0 m-0 max-md:gap-1.5">
                        {candidates[candidate.key].sources.map((source, idx) => (
                          <li key={idx}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block py-1 px-2.5 bg-gray-100 text-gray-600 text-[0.8rem] rounded-md no-underline transition-all duration-200 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap hover:bg-emerald-500 hover:text-white max-md:text-[0.75rem] max-md:py-1 max-md:px-2 max-md:max-w-[150px]"
                            >
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default Candidates
