import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Cadastro.css'

const tiposConta = [
  { value: 'operador', label: 'Operador' },
  { value: 'lojista', label: 'Lojista' },
]

function Cadastro() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [tipo, setTipo] = useState('')
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  // fechar o dorpdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tipoLabel = tiposConta.find(t => t.value === tipo)?.label

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (!tipo) {
      setErro('Selecione um tipo de conta.')
      return
    }

    setCarregando(true)

    // Mock: simula cadastro bem-sucedido sem backend
    setTimeout(() => {
      setSucesso('Cadastro realizado com sucesso! Redirecionando...')
      setCarregando(false)
      setTimeout(() => navigate('/'), 2000)
    }, 800)
  }

  const IconeOlho = ({ visivel }) => visivel ? (
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
  )

  return (
    <div className="cadastro-container">
      {/* Painel Esquerdo */}
      <div className="cadastro-left">
        <div className="cadastro-left-content">
          <div className="cadastro-logo-box">
            <img
              src="/duck-logo.png"
              alt="Duck Logo"
              className="cadastro-logo-img"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="cadastro-logo-fallback" style={{ display: 'none' }}>🦆</div>
          </div>
          <h1 className="cadastro-brand-title">Crie sua<br />conta</h1>
          <p className="cadastro-brand-subtitle">Centro de Distribuição</p>
          <div className="cadastro-brand-divider" />
          <p className="cadastro-brand-description">
            Preencha os dados ao lado para solicitar acesso ao sistema Duck.
          </p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="cadastro-right">
        <div className="cadastro-form-wrapper">
          <h2 className="cadastro-title">Cadastro</h2>
          <p className="cadastro-subtitle">Preencha os dados para criar sua conta</p>

          <form className="cadastro-form" onSubmit={handleSubmit}>

            {/* Nome */}
            <div className="cadastro-field">
              <label className="cadastro-label">Nome completo</label>
              <div className="cadastro-input-wrapper">
                <span className="cadastro-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="cadastro-input"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="cadastro-field">
              <label className="cadastro-label">E-mail</label>
              <div className="cadastro-input-wrapper">
                <span className="cadastro-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className="cadastro-input"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tipo de conta */}
            <div className="cadastro-field">
              <label className="cadastro-label">Tipo de conta</label>
              <div className="cadastro-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className={`cadastro-dropdown-trigger${dropdownAberto ? ' aberto' : ''}${!tipo ? ' sem-selecao' : ''}`}
                  onClick={() => setDropdownAberto(prev => !prev)}
                >
                  <span className="cadastro-dropdown-icone">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </span>
                  <span className="cadastro-dropdown-valor">
                    {tipoLabel || 'Selecione o tipo de conta'}
                  </span>
                  <span className={`cadastro-dropdown-seta${dropdownAberto ? ' aberta' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>

                {dropdownAberto && (
                  <ul className="cadastro-dropdown-lista">
                    {tiposConta.map(opcao => (
                      <li
                        key={opcao.value}
                        className={`cadastro-dropdown-item${tipo === opcao.value ? ' selecionado' : ''}`}
                        onClick={() => {
                          setTipo(opcao.value)
                          setDropdownAberto(false)
                        }}
                      >
                        {opcao.label}
                        {tipo === opcao.value && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Senha + Confirmar Senha */}
            <div className="cadastro-fields-row">
              <div className="cadastro-field">
                <label className="cadastro-label">Senha</label>
                <div className="cadastro-input-wrapper">
                  <span className="cadastro-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showSenha ? 'text' : 'password'}
                    className="cadastro-input"
                    placeholder="Mín. 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button type="button" className="cadastro-toggle-password" onClick={() => setShowSenha(!showSenha)}>
                    <IconeOlho visivel={showSenha} />
                  </button>
                </div>
              </div>

              <div className="cadastro-field">
                <label className="cadastro-label">Confirmar senha</label>
                <div className="cadastro-input-wrapper">
                  <span className="cadastro-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showConfirmar ? 'text' : 'password'}
                    className="cadastro-input"
                    placeholder="Repita sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                  <button type="button" className="cadastro-toggle-password" onClick={() => setShowConfirmar(!showConfirmar)}>
                    <IconeOlho visivel={showConfirmar} />
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {erro && <p className="cadastro-erro">{erro}</p>}
            {sucesso && <p className="cadastro-sucesso">{sucesso}</p>}

            <button type="submit" className="cadastro-btn" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <p className="cadastro-login-link">
            Já tem uma conta?{' '}
            <Link to="/" className="cadastro-link">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
