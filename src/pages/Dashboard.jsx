import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Dashboard.css'
 
function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const usuario = location.state?.usuario || 'Usuário'
 
  const handleLogout = () => {
    navigate('/')
  }
 
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <img
            src="/duck-logo.png"
            alt="Duck Logo"
            className="dashboard-logo-img"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className="dashboard-logo-name">Duck</span>
        </div>
 
        <div className="dashboard-welcome-text">
          Bem vindo - <strong>{usuario}</strong> !
        </div>
 
        <div className="dashboard-user">
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      </header>
 
      <main className="dashboard-main">
        {/* Conteúdo futuro do sistema */}
      </main>
    </div>
  )
}
 
export default Dashboard