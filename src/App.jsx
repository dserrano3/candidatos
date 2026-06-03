import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Candidates from './pages/Candidates'
import Category1 from './pages/Category1'
import Category2 from './pages/Category2'
import Category3 from './pages/Category3'
import Category4 from './pages/Category4'
import Category5 from './pages/Category5'
import Category6 from './pages/Category6'
import Category7 from './pages/Category7'
import Category8 from './pages/Category8'
import Category9 from './pages/Category9'
import Category10 from './pages/Category10'

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
        <Route path="/category7" element={<Category7 />} />
        <Route path="/category8" element={<Category8 />} />
        <Route path="/category9" element={<Category9 />} />
        <Route path="/category10" element={<Category10 />} />
      </Routes>
    </div>
  )
}

export default App
