import { Routes, Route } from 'react-router-dom'
import Candidates from './pages/Candidates'
import Category1 from './pages/Category1'
import Category2 from './pages/Category2'
import Category3 from './pages/Category3'
import Category4 from './pages/Category4'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Candidates />} />
        <Route path="/category1" element={<Category1 />} />
        <Route path="/category2" element={<Category2 />} />
        <Route path="/category3" element={<Category3 />} />
        <Route path="/category4" element={<Category4 />} />
      </Routes>
    </div>
  )
}

export default App
