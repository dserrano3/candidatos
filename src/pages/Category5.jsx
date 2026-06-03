import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { RiArrowDownSLine } from '@remixicon/react'
import { loadAllCandidates, getSeguridad } from '../utils/helpers'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

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

function Category5() {
  const [candidates, setCandidates] = useState({
    cepeda: { summary: 'Cargando...', sources: [] },
    espriella: { summary: 'Cargando...', sources: [] },
  })

  const [collapsed, setCollapsed] = useState(() => Object.fromEntries(CANDIDATE_INFO.map(c => [c.key, true])))
  const shuffledCandidates = useMemo(() => shuffle(CANDIDATE_INFO), [])

  useEffect(() => {
    const load = async () => {
      const data = await loadAllCandidates(getSeguridad)
      setCandidates(data)
    }
    load()
  }, [])

  return (
    <div className="p-[30px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-[900px]:p-6 max-md:p-5 max-md:rounded-xl max-[480px]:p-4 max-[480px]:rounded-[10px]">
      <h1 className="text-[#1a1a2e] mb-2.5 text-3xl font-bold max-md:text-2xl max-[480px]:text-[1.35rem]">Seguridad</h1>
      <p className="text-gray-500 mb-5 text-base">Resumen de las propuestas de seguridad de los candidatos.</p>

      <Navigation />

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

export default Category5
