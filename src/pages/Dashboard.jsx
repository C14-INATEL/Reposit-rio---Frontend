import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../api/api'
import '../styles/Dashboard.css'

const statusConfig = {
  criado:    { label: 'Criado',       classe: 'status-criado' },
  andamento: { label: 'Em andamento', classe: 'status-andamento' },
  enviado:   { label: 'Enviado',      classe: 'status-enviado' },
  entregue:  { label: 'Entregue',     classe: 'status-entregue' },
  cancelado: { label: 'Cancelado',    classe: 'status-cancelado' },
}

const tipoConfig = {
  admin:    { label: 'Admin',    classe: 'tipo-admin' },
  operador: { label: 'Operador', classe: 'tipo-operador' },
  lojista:  { label: 'Lojista',  classe: 'tipo-lojista' },
}

const navItems = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'usuarios', label: 'Usuários' },
  { id: 'lojas', label: 'Lojas' },
]

function formatarData(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

function statusVisual(status) {
  return statusConfig[status] || { label: status, classe: '' }
}

// icones SVG
function IcHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IcPedidos() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IcUsuarios() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function IcLojas() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <line x1="9" y1="22" x2="9" y2="12"/>
      <line x1="15" y1="22" x2="15" y2="12"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  )
}

function IcMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function IcLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function getIcone(id) {
  if (id === 'visao-geral') return <IcHome />
  if (id === 'pedidos') return <IcPedidos />
  if (id === 'usuarios') return <IcUsuarios />
  if (id === 'lojas') return <IcLojas />
  return null
}

function VisaoGeral({ resumo, entregas }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Visão Geral</h2>

      <div className="dash-cards">
        <div className="dash-card">
          <span className="dash-card-label">Total de Pedidos</span>
          <span className="dash-card-value">{resumo.totalPedidos}</span>
          <span className="dash-card-icon card-icon-total">
            <IcPedidos />
          </span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Em Andamento</span>
          <span className="dash-card-value card-value-andamento">{resumo.emAndamento}</span>
          <span className="dash-card-icon card-icon-andamento">
            <IcPedidos />
          </span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Entregues</span>
          <span className="dash-card-value card-value-entregue">{resumo.entregues}</span>
          <span className="dash-card-icon card-icon-entregue">
            <IcPedidos />
          </span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Lojas Cadastradas</span>
          <span className="dash-card-value card-value-lojas">{resumo.totalLojas}</span>
          <span className="dash-card-icon card-icon-lojas">
            <IcLojas />
          </span>
        </div>
      </div>

      <div className="dash-table-box">
        <h3 className="dash-table-title">Pedidos Recentes</h3>
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Loja</th>
              <th>Região</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {entregas.slice(0, 8).map(p => {
              const sv = statusVisual(p.status)
              return (
                <tr key={p.id}>
                  <td className="td-id">#{p.id}</td>
                  <td>{p.loja_nome}</td>
                  <td>{p.regiao_nome}</td>
                  <td>
                    <span className={`badge ${sv.classe}`}>{sv.label}</span>
                  </td>
                  <td className="td-data">{formatarData(p.data_pedido)}</td>
                </tr>
              )
            })}
            {entregas.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum pedido cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Pedidos({ entregas }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Pedidos</h2>
      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Loja</th>
              <th>Região</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map(p => {
              const sv = statusVisual(p.status)
              return (
                <tr key={p.id}>
                  <td className="td-id">#{p.id}</td>
                  <td>{p.loja_nome}</td>
                  <td>{p.regiao_nome}</td>
                  <td>{p.prioridade}</td>
                  <td>
                    <span className={`badge ${sv.classe}`}>{sv.label}</span>
                  </td>
                  <td>R$ {Number(p.custo || 0).toFixed(2)}</td>
                  <td className="td-data">{formatarData(p.data_pedido)}</td>
                </tr>
              )
            })}
            {entregas.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum pedido cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Usuarios({ usuarios }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Usuários</h2>
      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => {
              const tv = tipoConfig[u.tipo] || { label: u.tipo, classe: '' }
              return (
                <tr key={u.id}>
                  <td className="td-id">#{u.id}</td>
                  <td>{u.nome}</td>
                  <td className="td-email">{u.email}</td>
                  <td>
                    <span className={`badge ${tv.classe}`}>{tv.label}</span>
                  </td>
                </tr>
              )
            })}
            {usuarios.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum usuário.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Lojas({ lojas }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Lojas</h2>
      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Lojista</th>
            </tr>
          </thead>
          <tbody>
            {lojas.map(l => (
              <tr key={l.id}>
                <td className="td-id">#{l.id}</td>
                <td>{l.nome}</td>
                <td>{l.endereco}</td>
                <td>{l.telefone}</td>
                <td>{l.lojista || '-'}</td>
              </tr>
            ))}
            {lojas.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhuma loja.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const usuario = location.state?.usuario || sessionStorage.getItem('usuario') || 'Usuário'
  const tipo = location.state?.tipo || sessionStorage.getItem('tipo') || 'admin'

  const [secao, setSecao] = useState('visao-geral')
  const [recolhida, setRecolhida] = useState(false)
  const [entregas, setEntregas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [lojas, setLojas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErroCarregamento('')

    Promise.all([api.get('/entregas'), api.get('/usuarios'), api.get('/lojas')])
      .then(([e, u, l]) => {
        if (cancelado) return
        setEntregas(Array.isArray(e) ? e : [])
        setUsuarios(Array.isArray(u) ? u : [])
        setLojas(Array.isArray(l) ? l : [])
      })
      .catch(err => {
        console.error('Erro ao carregar dashboard:', err)
        if (!cancelado) setErroCarregamento(err.message || 'Erro ao carregar dados.')
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [])

  const resumo = useMemo(() => ({
    totalPedidos: entregas.length,
    emAndamento: entregas.filter(e => e.status === 'andamento' || e.status === 'enviado').length,
    entregues: entregas.filter(e => e.status === 'entregue').length,
    totalLojas: lojas.length,
  }), [entregas, lojas])

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const renderConteudo = () => {
    if (carregando) {
      return <div className="dash-section"><p style={{ padding: 24 }}>Carregando...</p></div>
    }
    if (erroCarregamento) {
      return (
        <div className="dash-section">
          <p style={{ padding: 24, color: '#c62828' }}>
            {erroCarregamento} — verifique se o backend está rodando em <code>http://localhost:3000</code>.
          </p>
        </div>
      )
    }
    if (secao === 'visao-geral') return <VisaoGeral resumo={resumo} entregas={entregas} />
    if (secao === 'pedidos') return <Pedidos entregas={entregas} />
    if (secao === 'usuarios') return <Usuarios usuarios={usuarios} />
    if (secao === 'lojas') return <Lojas lojas={lojas} />
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
          Bem vindo - <strong>{usuario}</strong>!
        </div>

        <div className="dashboard-user">
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <IcLogout />
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className={`dash-sidebar${recolhida ? ' recolhida' : ''}`}>
          <button
            className="dash-sidebar-toggle"
            onClick={() => setRecolhida(r => !r)}
            title={recolhida ? 'Expandir menu' : 'Recolher menu'}
          >
            <IcMenu />
          </button>

          <nav className="dash-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`dash-nav-item${secao === item.id ? ' ativo' : ''}`}
                onClick={() => setSecao(item.id)}
                title={recolhida ? item.label : ''}
              >
                <span className="dash-nav-icone">{getIcone(item.id)}</span>
                {!recolhida && <span className="dash-nav-label">{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">
          {renderConteudo()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
