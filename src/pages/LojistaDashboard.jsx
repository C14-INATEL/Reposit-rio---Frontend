// LojistaDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/LojistaDashboard.css'

// Dados mockados para lojista
const resumoInicial = {
  totalPedidos: 24,
  pendentes: 8,
  emRota: 5,
  entregues: 11,
}

const pedidosMock = [
  { id: 1, regiao: 'Sul', peso: 10, tipo: 'Normal', status: 2, data: '05/04/2026', custo: 50 },
  { id: 2, regiao: 'Sudeste', peso: 5, tipo: 'Urgente', status: 1, data: '04/04/2026', custo: 80 },
  { id: 3, regiao: 'Sul', peso: 15, tipo: 'Normal', status: 3, data: '04/04/2026', custo: 75 },
  { id: 4, regiao: 'Norte', peso: 8, tipo: 'Normal', status: 1, data: '03/04/2026', custo: 40 },
  { id: 5, regiao: 'Centro-Oeste', peso: 12, tipo: 'Urgente', status: 3, data: '02/04/2026', custo: 108 },
]

const statusConfig = {
  1: { label: 'Pendente', classe: 'status-pendente' },
  2: { label: 'Em rota', classe: 'status-emrota' },
  3: { label: 'Entregue', classe: 'status-entregue' },
  4: { label: 'Cancelado', classe: 'status-cancelado' },
}

const tipoConfig = {
  Normal: { label: 'Normal', classe: 'tipo-normal' },
  Urgente: { label: 'Urgente', classe: 'tipo-urgente' },
}

const navItems = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'pedidos', label: 'Pedidos' },
]

// Ícones SVG (reutilizando do admin)
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

function IcNovoPedido() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function getIcone(id) {
  if (id === 'visao-geral') return <IcHome />
  if (id === 'pedidos') return <IcPedidos />
  return null
}

function gerarIdRastreio() {
  // UUID v4 simples - padrão da indústria (melhor prática)
  return 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase() + 
         '-' + Date.now().toString(36).toUpperCase().substr(-4);
}

function calcularCusto(peso, tipo) {
  let base = peso * 5
  if (tipo === 'Urgente') base *= 1.5
  return Math.round(base)
}

function VisaoGeral({ resumo, pedidos, onNovoPedido }) {
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
          <span className="dash-card-label">Pendentes</span>
          <span className="dash-card-value card-value-pendente">{resumo.pendentes}</span>
          <span className="dash-card-icon card-icon-pendente">
            <IcPedidos />
          </span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Em Rota</span>
          <span className="dash-card-value card-value-emrota">{resumo.emRota}</span>
          <span className="dash-card-icon card-icon-emrota">
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
      </div>

      <div className="dash-table-box">
        <div className="dash-table-header">
          <h3 className="dash-table-title">Pedidos Recentes</h3>
          <button className="dash-btn-novo" onClick={onNovoPedido}>
            <IcNovoPedido />
            Novo Pedido
          </button>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Região</th>
              <th>Peso</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Rastreio</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.slice(0, 5).map(p => (
              <tr key={p.id}>
                <td className="td-id">#{p.id}</td>
                <td>{p.regiao}</td>
                <td>{p.peso}kg</td>
                <td>
                  <span className={`badge ${tipoConfig[p.tipo].classe}`}>
                    {tipoConfig[p.tipo].label}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusConfig[p.status].classe}`}>
                    {statusConfig[p.status].label}
                  </span>
                </td>
                <td className="td-data">R$ {p.custo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Pedidos({ pedidos, onNovoPedido, onEditarPedido, onCancelarPedido }) {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2 className="dash-section-title">Meus Pedidos</h2>
        <button className="dash-btn-novo" onClick={onNovoPedido}>
          <IcNovoPedido />
          Novo Pedido
        </button>
      </div>

      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Região</th>
              <th>Peso</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td className="td-id">#{p.id}</td>
                <td>{p.regiao}</td>
                <td>{p.peso}kg</td>
                <td>
                  <span className={`badge ${tipoConfig[p.tipo].classe}`}>
                    {tipoConfig[p.tipo].label}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusConfig[p.status].classe}`}>
                    {statusConfig[p.status].label}
                  </span>
                </td>
                <td className="td-data">R$ {p.custo}</td>
                <td>

                  <td className="td-rastreio">
                    <div className="td-rastreio">
                     <strong>{p.rastreio}</strong>
                    <button 

                     className="btn-copiar" 
                     onClick={() => navigator.clipboard.writeText(p.rastreio)}
                     title="Copiar rastreio"
                   >
    
                   </button>
                   </div>
                   </td>
                  
                  <div className="acoes">
                    {p.status === 1 && (
                      <>
                        <button className="btn-editar" onClick={() => onEditarPedido(p)}>
                          Editar
                        </button>
                        <button className="btn-cancelar" onClick={() => onCancelarPedido(p.id)}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FormNovoPedido({ onClose, onCreate, novoPedido, setNovoPedido }) {
  const custo = calcularCusto(parseFloat(novoPedido.peso) || 0, novoPedido.tipo)

  return (
    <div className="form-overlay">
      <div className="form-sidebar">
        <div className="form-header">
          <h3>Novo Pedido</h3>
          <button className="form-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-body">
          <label>Região *</label>
          <select 
            value={novoPedido.regiao} 
            onChange={e => setNovoPedido({ ...novoPedido, regiao: e.target.value })}
            required
          >
            <option value="">Selecione</option>
            <option value="Sul">Sul</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Norte">Norte</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
          </select>

          <label>Peso (kg) *</label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={novoPedido.peso}
            onChange={e => setNovoPedido({ ...novoPedido, peso: e.target.value })}
            required
          />

          <label>Tipo</label>
          <select 
            value={novoPedido.tipo} 
            onChange={e => setNovoPedido({ ...novoPedido, tipo: e.target.value })}
          >
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>

          <div className="custo-preview">
            Custo estimado: <strong>R$ {custo}</strong>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={onCreate} disabled={!novoPedido.regiao || !novoPedido.peso}>
              Criar Pedido
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LojistaDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const usuario = location.state?.usuario || sessionStorage.getItem('usuario') || 'Lojista'
  
  const [secao, setSecao] = useState('visao-geral')
  const [recolhida, setRecolhida] = useState(false)
  const [pedidos, setPedidos] = useState(pedidosMock)
  const [resumo, setResumo] = useState(resumoInicial)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [novoPedido, setNovoPedido] = useState({
    regiao: '',
    peso: '',
    tipo: 'Normal'
  })
  const [editandoPedido, setEditandoPedido] = useState(null)

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    // Recalcular resumo baseado nos pedidos
    const pendentes = pedidos.filter(p => p.status === 1).length
    const emRota = pedidos.filter(p => p.status === 2).length
    const entregues = pedidos.filter(p => p.status === 3).length
    
    setResumo({
      totalPedidos: pedidos.length,
      pendentes,
      emRota,
      entregues
    })
  }, [pedidos])

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const criarPedido = () => {
     const rastreio = gerarIdRastreio(); // GERA ID RASTREIO AUTOMATICAMENTE
     const novo = {
    id: Math.max(...pedidos.map(p => p.id), 0) + 1,
    rastreio: rastreio,
    lojista: usuario,   // Nome do lojista atual
    ...novoPedido,
    status: 1,
    data: new Date().toLocaleDateString('pt-BR'),
    custo: calcularCusto(parseFloat(novoPedido.peso), novoPedido.tipo)
  }

    setPedidos([novo, ...pedidos])
    setMostrarForm(false)
    setNovoPedido({ regiao: '', peso: '', tipo: 'Normal' })

    alert(`Pedido criado!\nID: ${novo.id}\nRastreio: ${rastreio}\n\nCompartilhe o código de rastreio com seu cliente!`)
  }

  const editarPedido = (pedido) => {
    setEditandoPedido(pedido)
    setNovoPedido({
      regiao: pedido.regiao,
      peso: pedido.peso.toString(),
      tipo: pedido.tipo
    })
    setMostrarForm(true)
  }

  const salvarEdicao = () => {
    setPedidos(pedidos.map(p =>
      p.id === editandoPedido.id
        ? {
            ...p,
            ...novoPedido,
            custo: calcularCusto(parseFloat(novoPedido.peso), novoPedido.tipo)
          }
        : p
    ))
    setMostrarForm(false)
    setNovoPedido({ regiao: '', peso: '', tipo: 'Normal' })
    setEditandoPedido(null)
  }

  const cancelarPedido = (id) => {
    setPedidos(pedidos.map(p =>
      p.id === id && p.status === 1
        ? { ...p, status: 4 }
        : p
    ))
  }

  const renderConteudo = () => {
    if (secao === 'visao-geral') {
      return (
        <VisaoGeral
          resumo={resumo}
          pedidos={pedidos}
          onNovoPedido={() => setMostrarForm(true)}
        />
      )
    }
    if (secao === 'pedidos') {
      return (
        <Pedidos
          pedidos={pedidos}
          onNovoPedido={() => setMostrarForm(true)}
          onEditarPedido={editarPedido}
          onCancelarPedido={cancelarPedido}
        />
      )
    }
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

      {mostrarForm && (
        <FormNovoPedido
          onClose={() => {
            setMostrarForm(false)
            setNovoPedido({ regiao: '', peso: '', tipo: 'Normal' })
            setEditandoPedido(null)
          }}
          onCreate={editandoPedido ? salvarEdicao : criarPedido}
          novoPedido={novoPedido}
          setNovoPedido={setNovoPedido}
        />
      )}
    </div>
  )
}

export default LojistaDashboard