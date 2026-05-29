import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Candidates from './pages/Candidates'
import Category1 from './pages/Category1'
import Category2 from './pages/Category2'
import Category3 from './pages/Category3'
import Category4 from './pages/Category4'
import Category5 from './pages/Category5'
import Category6 from './pages/Category6'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: location.pathname })
    }
  }, [location])

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-5">
      <Routes>
        <Route path="/" element={<Candidates />} />
        <Route path="/category1" element={<Category1 />} />
        <Route path="/category2" element={<Category2 />} />
        <Route path="/category3" element={<Category3 />} />
        <Route path="/category4" element={<Category4 />} />
        <Route path="/category5" element={<Category5 />} />
        <Route path="/category6" element={<Category6 />} />
      </Routes>
    </div>
  )
}

export default App
