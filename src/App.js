import { Routes } from 'react-router-dom'
import './App.css'
import { Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <div className="w-screen min-h-screen bg-richBlack-900 flex flex-col font-inter">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
