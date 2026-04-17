import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cadastro from './pages/Cadastro'
import LojistaDashboard from './pages/LojistaDashboard'
import Rastreio from './pages/Rastreio'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/rastrear" element={<Rastreio/>} />
        <Route path="/lojista" element={<LojistaDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
 
export default App