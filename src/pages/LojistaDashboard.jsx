// LojistaDashboard.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/api'
import '../styles/LojistaDashboard.css'

const statusConfig = {
  criado:    { label: 'Pendente',  classe: 'status-pendente' },
  andamento: { label: 'Em rota',   classe: 'status-emrota' },
  enviado:   { label: 'Em rota',   classe: 'status-emrota' },
  entregue:  { label: 'Entregue',  classe: 'status-entregue' },
  cancelado: { label: 'Cancelado', classe: 'status-cancelado' },
}

const prioridadeConfig = {
  baixa:   { label: 'Baixa',   classe: 'tipo-normal' },
  media:   { label: 'Normal',  classe: 'tipo-normal' },
  alta:    { label: 'Alta',    classe: 'tipo-urgente' },
  urgente: { label: 'Urgente', classe: 'tipo-urgente' },
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

function codigoRastreio(id) {
  return `DUCK-${String(id).padStart(5, '0')}`
}

function calcularCusto(regiao, prioridade) {
  if (!regiao) return 0
  const base = Number(regiao.custo_base) || 0
  const fator = prioridade === 'urgente' ? 1.5 : prioridade === 'alta' ? 1.25 : 1
  return Number((base * fator).toFixed(2))
}

function statusVisual(status) {
  return statusConfig[status] || { label: status, classe: '' }
}

function prioridadeVisual(prio) {
  return prioridadeConfig[prio] || { label: prio, classe: '' }
}

function formatarData(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

function VisaoGeral({ resumo, entregas, onNovoPedido }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Visão Geral</h2>

      <div className="dash-cards">
        <div className="dash-card">
          <span className="dash-card-label">Total de Pedidos</span>
          <span className="dash-card-value">{resumo.totalPedidos}</span>
          <span className="dash-card-icon card-icon-total"><IcPedidos /></span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Pendentes</span>
          <span className="dash-card-value card-value-pendente">{resumo.pendentes}</span>
          <span className="dash-card-icon card-icon-pendente"><IcPedidos /></span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Em Rota</span>
          <span className="dash-card-value card-value-emrota">{resumo.emRota}</span>
          <span className="dash-card-icon card-icon-emrota"><IcPedidos /></span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Entregues</span>
          <span className="dash-card-value card-value-entregue">{resumo.entregues}</span>
          <span className="dash-card-icon card-icon-entregue"><IcPedidos /></span>
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
              <th>Descrição</th>
              <th>Região</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Rastreio</th>
            </tr>
          </thead>
          <tbody>
            {entregas.slice(0, 5).map(p => {
              const sv = statusVisual(p.status)
              const pv = prioridadeVisual(p.prioridade)
              return (
                <tr key={p.id}>
                  <td className="td-id">#{p.id}</td>
                  <td>{p.descricao}</td>
                  <td>{p.regiao_nome}</td>
                  <td><span className={`badge ${pv.classe}`}>{pv.label}</span></td>
                  <td><span className={`badge ${sv.classe}`}>{sv.label}</span></td>
                  <td className="td-data">R$ {Number(p.custo || 0).toFixed(2)}</td>
                  <td><code>{codigoRastreio(p.id)}</code></td>
                </tr>
              )
            })}
            {entregas.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum pedido. Clique em "Novo Pedido" para começar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Pedidos({ entregas, onNovoPedido, onEditarPedido, onCancelarPedido }) {
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
              <th>Descrição</th>
              <th>Região</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Rastreio</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map(p => {
              const sv = statusVisual(p.status)
              const pv = prioridadeVisual(p.prioridade)
              return (
                <tr key={p.id}>
                  <td className="td-id">#{p.id}</td>
                  <td>{p.descricao}</td>
                  <td>{p.regiao_nome}</td>
                  <td><span className={`badge ${pv.classe}`}>{pv.label}</span></td>
                  <td><span className={`badge ${sv.classe}`}>{sv.label}</span></td>
                  <td className="td-data">R$ {Number(p.custo || 0).toFixed(2)}</td>
                  <td>
                    <div className="td-rastreio">
                      <strong>{codigoRastreio(p.id)}</strong>
                      <button
                        className="btn-copiar"
                        onClick={() => navigator.clipboard.writeText(codigoRastreio(p.id))}
                        title="Copiar rastreio"
                      >
                        ⎘
                      </button>
                    </div>
                  </td>
                  <td className="td-data">{formatarData(p.data_pedido)}</td>
                  <td>
                    <div className="acoes">
                      {p.status === 'criado' && (
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
              )
            })}
            {entregas.length === 0 && (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum pedido cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FormPedido({ onClose, onSubmit, form, setForm, regioes, lojas, editando, salvando }) {
  const regiaoSelecionada = regioes.find(r => r.id === Number(form.regiao_id))
  const custo = calcularCusto(regiaoSelecionada, form.prioridade)
  const precisaEscolherLoja = lojas.length > 1

  return (
    <div className="form-overlay">
      <div className="form-sidebar">
        <div className="form-header">
          <h3>{editando ? 'Editar Pedido' : 'Novo Pedido'}</h3>
          <button className="form-close" onClick={onClose}>×</button>
        </div>

        <div className="form-body">
          {precisaEscolherLoja && (
            <>
              <label>Loja *</label>
              <select
                value={form.loja_id}
                onChange={e => setForm({ ...form, loja_id: e.target.value })}
                required
              >
                <option value="">Selecione</option>
                {lojas.map(l => (
                  <option key={l.id} value={l.id}>{l.nome}</option>
                ))}
              </select>
            </>
          )}

          <label>Descrição *</label>
          <input
            type="text"
            placeholder="Ex: 5kg de produtos refrigerados"
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
            required
          />

          <label>Região *</label>
          <select
            value={form.regiao_id}
            onChange={e => setForm({ ...form, regiao_id: e.target.value })}
            required
          >
            <option value="">Selecione</option>
            {regioes.map(r => (
              <option key={r.id} value={r.id}>
                {r.nome} (base R$ {Number(r.custo_base).toFixed(2)})
              </option>
            ))}
          </select>

          <label>Prioridade</label>
          <select
            value={form.prioridade}
            onChange={e => setForm({ ...form, prioridade: e.target.value })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>

          <div className="custo-preview">
            Custo estimado: <strong>R$ {custo.toFixed(2)}</strong>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={onSubmit}
              disabled={salvando || !form.descricao || !form.regiao_id || (precisaEscolherLoja && !form.loja_id)}
            >
              {salvando ? 'Salvando...' : (editando ? 'Salvar' : 'Criar Pedido')}
            </button>
            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FORM_INICIAL(lojaPadrao) {
  return {
    loja_id: lojaPadrao || '',
    descricao: '',
    regiao_id: '',
    prioridade: 'media',
  }
}

function LojistaDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const usuario = location.state?.usuario || sessionStorage.getItem('usuario') || 'Lojista'
  const userId = location.state?.userId || sessionStorage.getItem('userId')

  const [secao, setSecao] = useState('visao-geral')
  const [recolhida, setRecolhida] = useState(false)

  const [entregas, setEntregas] = useState([])
  const [lojas, setLojas] = useState([])
  const [regioes, setRegioes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(FORM_INICIAL())
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      navigate('/')
    }
  }, [navigate])

  const carregarTudo = () => {
    if (!userId) {
      setErroCarregamento('Não foi possível identificar o usuário logado. Faça login novamente.')
      setCarregando(false)
      return
    }
    setCarregando(true)
    setErroCarregamento('')

    Promise.all([
      api.get(`/entregas?lojista_id=${userId}`),
      api.get(`/lojas?usuario_id=${userId}`),
      api.get('/regioes'),
    ])
      .then(([e, l, r]) => {
        setEntregas(Array.isArray(e) ? e : [])
        setLojas(Array.isArray(l) ? l : [])
        setRegioes(Array.isArray(r) ? r : [])
      })
      .catch(err => {
        console.error('Erro ao carregar dashboard do lojista:', err)
        setErroCarregamento(err.message || 'Erro ao carregar dados.')
      })
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregarTudo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const resumo = useMemo(() => ({
    totalPedidos: entregas.length,
    pendentes:    entregas.filter(e => e.status === 'criado').length,
    emRota:       entregas.filter(e => e.status === 'andamento' || e.status === 'enviado').length,
    entregues:    entregas.filter(e => e.status === 'entregue').length,
  }), [entregas])

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const abrirNovoPedido = () => {
    setEditando(null)
    const lojaPadrao = lojas.length === 1 ? lojas[0].id : ''
    setForm(FORM_INICIAL(lojaPadrao))
    setMostrarForm(true)
  }

  const fecharForm = () => {
    setMostrarForm(false)
    setEditando(null)
    setForm(FORM_INICIAL())
  }

  const editarPedido = (p) => {
    setEditando(p)
    setForm({
      loja_id: p.loja_id,
      descricao: p.descricao || '',
      regiao_id: p.regiao_id,
      prioridade: p.prioridade,
    })
    setMostrarForm(true)
  }

  const salvar = async () => {
    if (lojas.length === 0) {
      alert('Você ainda não tem nenhuma loja cadastrada. Peça ao admin para cadastrar.')
      return
    }
    const lojaIdFinal = form.loja_id || (lojas[0] && lojas[0].id)
    const regiao = regioes.find(r => r.id === Number(form.regiao_id))
    const custo = calcularCusto(regiao, form.prioridade)

    const payload = {
      descricao: form.descricao,
      loja_id: Number(lojaIdFinal),
      regiao_id: Number(form.regiao_id),
      prioridade: form.prioridade,
      custo,
    }

    setSalvando(true)
    try {
      if (editando) {
        await api.put(`/entregas/${editando.id}`, payload)
      } else {
        await api.post('/entregas', payload)
      }
      fecharForm()
      carregarTudo()
    } catch (err) {
      alert(`Erro ao salvar: ${err.message}`)
    } finally {
      setSalvando(false)
    }
  }

  const cancelarPedido = async (id) => {
    if (!confirm('Cancelar este pedido?')) return
    try {
      await api.patch(`/entregas/${id}`, { status: 'cancelado' })
      carregarTudo()
    } catch (err) {
      alert(`Erro ao cancelar: ${err.message}`)
    }
  }

  const renderConteudo = () => {
    if (carregando) {
      return <div className="dash-section"><p style={{ padding: 24 }}>Carregando...</p></div>
    }
    if (erroCarregamento) {
      return (
        <div className="dash-section">
          <p style={{ padding: 24, color: '#c62828' }}>
            {erroCarregamento}
          </p>
        </div>
      )
    }
    if (lojas.length === 0) {
      return (
        <div className="dash-section">
          <p style={{ padding: 24 }}>
            Você ainda não tem lojas cadastradas. Peça ao admin para cadastrar uma loja vinculada à sua conta.
          </p>
        </div>
      )
    }
    if (secao === 'visao-geral') {
      return (
        <VisaoGeral
          resumo={resumo}
          entregas={entregas}
          onNovoPedido={abrirNovoPedido}
        />
      )
    }
    if (secao === 'pedidos') {
      return (
        <Pedidos
          entregas={entregas}
          onNovoPedido={abrirNovoPedido}
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
        <FormPedido
          onClose={fecharForm}
          onSubmit={salvar}
          form={form}
          setForm={setForm}
          regioes={regioes}
          lojas={lojas}
          editando={!!editando}
          salvando={salvando}
        />
      )}
    </div>
  )
}

export default LojistaDashboard
