import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
 
// Usuário mockado para teste
const MOCK_USER = 'admin'
const MOCK_PASS = 'admin'
 
function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
 
  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
 
    if (usuario === MOCK_USER && senha === MOCK_PASS) {
      navigate('/dashboard', { state: { usuario } })
    } else {
      setErro('Usuário ou senha incorretos.')
    }
  }
 
  return (
    <div className="login-container">
      {/* Painel Esquerdo */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo-box">
            <img
              src="/duck-logo.png"
              alt="Duck Logo"
              className="login-logo-img"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="login-logo-fallback" style={{ display: 'none' }}>🦆</div>
          </div>
 
          <h1 className="login-brand-title">Bem-vindo ao<br />Duck</h1>
          <p className="login-brand-subtitle">Centro de Distribuição</p>
          <div className="login-brand-divider" />
          <p className="login-brand-description">
            Gerencie suas operações com eficiência e praticidade.<br />
          </p>
        </div>
      </div>
 
      {/* Painel Direito */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Acesse sua conta para continuar</p>
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Campo Usuário */}
            <div className="login-field">
              <label className="login-label">Usuário</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Digite seu usuário"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>
            </div>
 
            {/* Campo Senha */}
            <div className="login-field">
              <label className="login-label">Senha</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
 
            {/* Erro */}
            {erro && <p className="login-erro">{erro}</p>}
 
            {/* Lembrar-me + Esqueceu a senha */}
            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="login-checkbox-custom" />
                Lembrar-me
              </label>
              <a href="#" className="login-forgot">Esqueceu a senha?</a>
            </div>
 
            <button type="submit" className="login-btn">Entrar</button>
          </form>
 
          <p className="login-register">
            Não tem uma conta?{' '}
            <a href="#" className="login-register-link">Solicitar acesso</a>
          </p>
        </div>
      </div>
    </div>
  )
}
 
export default Login