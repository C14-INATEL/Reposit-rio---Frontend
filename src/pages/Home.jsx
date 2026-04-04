import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">

      {/* Lado esquerdo - texto */}
      <div className="home-left">
        <p className="home-tag">SISTEMA</p>
        <h1 className="home-title">Bem-vindo ao<br />Duck</h1>
        <p className="home-description">
          Gerencie suas operações de entrega com eficiência e praticidade.
        </p>

        <div className="home-buttons">
          <button className="home-btn home-btn-primary" onClick={() => navigate('/login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Entrar no Sistema
          </button>

          <button className="home-btn home-btn-secondary" onClick={() => navigate('/rastrear')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Rastrear Pedido
          </button>
        </div>
      </div>

      {/* Lado direito - imagem */}
      <div className="home-right">
        <div className="home-img-box">
          <img
            src="/duck-logo.png"
            alt="Duck Logo"
            className="home-img"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="home-img-fallback" style={{ display: 'none' }}>🦆</div>
        </div>
      </div>

    </div>
  )
}

export default Home