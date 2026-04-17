import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import '../styles/Dashboard.css'

// dados mockados apenas para visualização
const resumo = {
  totalPedidos: 24,
  emAndamento: 8,
  entregues: 13,
  totalLojas: 2,
}

const pedidosMock = [
  { id: 1, loja: 'Loja A', regiao: 'Sul', status: 2, data: '05/04/2026' },
  { id: 2, loja: 'Loja B', regiao: 'Sudeste', status: 4, data: '04/04/2026' },
  { id: 3, loja: 'Loja A', regiao: 'Sul', status: 1, data: '04/04/2026' },
  { id: 4, loja: 'Loja B', regiao: 'Norte', status: 3, data: '03/04/2026' },
  { id: 5, loja: 'Loja A', regiao: 'Centro-Oeste', status: 4, data: '02/04/2026' },
  { id: 6, loja: 'Loja B', regiao: 'Sudeste', status: 2, data: '01/04/2026' },
]


const API = 'http://localhost:3000'

const statusConfig = {
  1: { label: 'Criado', classe: 'status-criado' },
  2: { label: 'Em andamento', classe: 'status-andamento' },
  3: { label: 'Enviado', classe: 'status-enviado' },
  4: { label: 'Entregue', classe: 'status-entregue' },
}

const tipoConfig = {
  admin: { label: 'Admin', classe: 'tipo-admin' },
  operador: { label: 'Operador', classe: 'tipo-operador' },
  lojista: { label: 'Lojista', classe: 'tipo-lojista' },
}

const navItems = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'usuarios', label: 'Usuários' },
  { id: 'lojas', label: 'Lojas' },
]

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

function DropdownSelect({ value, onChange, options, placeholder = 'Selecione...' }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)
  const selecionado = options.find(o => String(o.value) === String(value))

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="ds-dropdown" ref={ref}>
      <button
        type="button"
        className={`ds-trigger${aberto ? ' ds-aberto' : ''}${!value ? ' ds-vazio' : ''}`}
        onClick={() => setAberto(a => !a)}
      >
        <span className="ds-valor">{selecionado ? selecionado.label : placeholder}</span>
        <span className={`ds-seta${aberto ? ' ds-seta-aberta' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      {aberto && (
        <ul className="ds-lista">
          {options.map(o => (
            <li
              key={o.value}
              className={`ds-item${String(o.value) === String(value) ? ' ds-selecionado' : ''}`}
              onClick={() => { onChange(o.value); setAberto(false) }}
            >
              {o.label}
              {String(o.value) === String(value) && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function IcEditar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IcExcluir() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-fechar" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function getIcone(id) {
  if (id === 'visao-geral') return <IcHome />
  if (id === 'pedidos') return <IcPedidos />
  if (id === 'usuarios') return <IcUsuarios />
  if (id === 'lojas') return <IcLojas />
  return null
}

function VisaoGeral() {
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
            {pedidosMock.map(p => (
              <tr key={p.id}>
                <td className="td-id">#{p.id}</td>
                <td>{p.loja}</td>
                <td>{p.regiao}</td>
                <td>
                  <span className={`badge ${statusConfig[p.status].classe}`}>
                    {statusConfig[p.status].label}
                  </span>
                </td>
                <td className="td-data">{p.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Pedidos() {
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
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {pedidosMock.map(p => (
              <tr key={p.id}>
                <td className="td-id">#{p.id}</td>
                <td>{p.loja}</td>
                <td>{p.regiao}</td>
                <td>
                  <span className={`badge ${statusConfig[p.status].classe}`}>
                    {statusConfig[p.status].label}
                  </span>
                </td>
                <td className="td-data">{p.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const tiposUsuario = [
  { value: 'admin', label: 'Admin' },
  { value: 'operador', label: 'Operador' },
  { value: 'lojista', label: 'Lojista' },
]

function Usuarios({ tipo }) {
  const [usuarios, setUsuarios] = useState([])
  const [modalExcluir, setModalExcluir] = useState(null)
  const [modalEditar, setModalEditar] = useState(null)
  const [formEditar, setFormEditar] = useState({ nome: '', email: '', tipo: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const buscarUsuarios = () => {
    fetch(`${API}/usuarios`)
      .then(r => r.json())
      .then(setUsuarios)
      .catch(() => {})
  }

  useEffect(() => { buscarUsuarios() }, [])

  const abrirEditar = (u) => {
    setFormEditar({ nome: u.nome, email: u.email, tipo: u.tipo })
    setModalEditar(u)
    setErro('')
  }

  const handleEditar = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    try {
      const response = await fetch(`${API}/usuarios/${modalEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditar),
      })
      const data = await response.json()
      if (response.ok) {
        setModalEditar(null)
        buscarUsuarios()
      } else {
        setErro(data.mensagem || 'Erro ao atualizar.')
      }
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  const handleExcluir = async () => {
    try {
      const response = await fetch(`${API}/usuarios/${modalExcluir.id}`, { method: 'DELETE' })
      if (response.ok) {
        setModalExcluir(null)
        buscarUsuarios()
      } else {
        const data = await response.json()
        alert(data.mensagem)
      }
    } catch {
      alert('Erro ao conectar com o servidor.')
    }
  }

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
              {tipo === 'admin' && <th className="th-acoes">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr><td colSpan={tipo === 'admin' ? 5 : 4} style={{ textAlign: 'center', color: '#aaa' }}>Nenhum usuário encontrado.</td></tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id}>
                  <td className="td-id">#{u.id}</td>
                  <td>{u.nome}</td>
                  <td className="td-email">{u.email}</td>
                  <td>
                    <span className={`badge ${tipoConfig[u.tipo]?.classe}`}>
                      {tipoConfig[u.tipo]?.label}
                    </span>
                  </td>
                  {tipo === 'admin' && (
                    <td className="td-acoes">
                      <button className="btn-acao btn-editar" title="Editar" onClick={() => abrirEditar(u)}><IcEditar /></button>
                      <button className="btn-acao btn-excluir" title="Excluir" onClick={() => { setModalExcluir(u); setErro('') }}><IcExcluir /></button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalExcluir && (
        <Modal titulo="Confirmar exclusão" onClose={() => setModalExcluir(null)}>
          <p className="modal-mensagem">Tem certeza que deseja excluir o usuário <strong>{modalExcluir.nome}</strong>?</p>
          <p className="modal-aviso">Esta ação não pode ser desfeita.</p>
          <div className="modal-acoes">
            <button className="modal-btn-cancelar" onClick={() => setModalExcluir(null)}>Cancelar</button>
            <button className="modal-btn-excluir" onClick={handleExcluir}>Excluir</button>
          </div>
        </Modal>
      )}

      {modalEditar && (
        <Modal titulo="Editar Usuário" onClose={() => setModalEditar(null)}>
          <form className="modal-form" onSubmit={handleEditar}>
            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input className="modal-input" type="text" value={formEditar.nome} onChange={e => setFormEditar(f => ({ ...f, nome: e.target.value }))} required />
            </div>
            <div className="modal-field">
              <label className="modal-label">E-mail</label>
              <input className="modal-input" type="email" value={formEditar.email} onChange={e => setFormEditar(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="modal-field">
              <label className="modal-label">Tipo</label>
              <DropdownSelect
                value={formEditar.tipo}
                onChange={val => setFormEditar(f => ({ ...f, tipo: val }))}
                options={tiposUsuario}
                placeholder="Selecione o tipo"
              />
            </div>
            {erro && <p className="modal-erro">{erro}</p>}
            <div className="modal-acoes">
              <button type="button" className="modal-btn-cancelar" onClick={() => setModalEditar(null)}>Cancelar</button>
              <button type="submit" className="modal-btn-salvar" disabled={carregando}>{carregando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Lojas({ tipo }) {
  const [lojas, setLojas] = useState([])
  const [lojistas, setLojistas] = useState([])
  const [form, setForm] = useState({ nome: '', endereco: '', telefone: '', usuario_id: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(null)
  const [modalEditar, setModalEditar] = useState(null)
  const [formEditar, setFormEditar] = useState({ nome: '', endereco: '', telefone: '', usuario_id: '' })
  const [erroModal, setErroModal] = useState('')
  const [carregandoModal, setCarregandoModal] = useState(false)

  const buscarLojas = () => {
    fetch(`${API}/lojas`)
      .then(r => r.json())
      .then(setLojas)
      .catch(() => setErro('Erro ao carregar lojas.'))
  }

  useEffect(() => {
    buscarLojas()
    if (tipo === 'admin') {
      fetch(`${API}/usuarios?tipo=lojista`)
        .then(r => r.json())
        .then(setLojistas)
    }
  }, [tipo])

  const abrirEditar = (l) => {
    setFormEditar({ nome: l.nome, endereco: l.endereco || '', telefone: l.telefone || '', usuario_id: l.usuario_id })
    setModalEditar(l)
    setErroModal('')
  }

  const handleEditar = async (e) => {
    e.preventDefault()
    setCarregandoModal(true)
    setErroModal('')
    try {
      const response = await fetch(`${API}/lojas/${modalEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formEditar, usuario_id: Number(formEditar.usuario_id) }),
      })
      const data = await response.json()
      if (response.ok) {
        setModalEditar(null)
        buscarLojas()
      } else {
        setErroModal(data.mensagem || 'Erro ao atualizar.')
      }
    } catch {
      setErroModal('Erro ao conectar com o servidor.')
    } finally {
      setCarregandoModal(false)
    }
  }

  const handleExcluir = async () => {
    try {
      const response = await fetch(`${API}/lojas/${modalExcluir.id}`, { method: 'DELETE' })
      const data = await response.json()
      if (response.ok) {
        setModalExcluir(null)
        buscarLojas()
      } else {
        setErroModal(data.mensagem || 'Erro ao excluir.')
      }
    } catch {
      setErroModal('Erro ao conectar com o servidor.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)
    try {
      const response = await fetch(`${API}/lojas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, usuario_id: Number(form.usuario_id) }),
      })
      if (response.ok) {
        setSucesso('Loja cadastrada com sucesso!')
        setForm({ nome: '', endereco: '', telefone: '', usuario_id: '' })
        setMostrarForm(false)
        buscarLojas()
      } else {
        const data = await response.json()
        setErro(data.mensagem || 'Erro ao cadastrar loja.')
      }
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2 className="dash-section-title">Lojas</h2>
        {tipo === 'admin' && (
          <button className="dash-btn-novo" onClick={() => { setMostrarForm(m => !m); setErro(''); setSucesso('') }}>
            {mostrarForm ? 'Cancelar' : '+ Nova Loja'}
          </button>
        )}
      </div>

      {mostrarForm && tipo === 'admin' && (
        <div className="dash-form-box">
          <h3 className="dash-form-title">Cadastrar Nova Loja</h3>
          <form className="dash-form" onSubmit={handleSubmit}>
            <div className="dash-form-row">
              <div className="dash-form-field">
                <label className="dash-form-label">Nome *</label>
                <input
                  className="dash-form-input"
                  type="text"
                  placeholder="Nome da loja"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  required
                />
              </div>
              <div className="dash-form-field">
                <label className="dash-form-label">Usuário Lojista *</label>
                <DropdownSelect
                  value={form.usuario_id}
                  onChange={val => setForm(f => ({ ...f, usuario_id: val }))}
                  options={lojistas.map(u => ({ value: u.id, label: u.nome }))}
                  placeholder="Selecione o lojista"
                />
              </div>
            </div>
            <div className="dash-form-row">
              <div className="dash-form-field">
                <label className="dash-form-label">Endereço</label>
                <input
                  className="dash-form-input"
                  type="text"
                  placeholder="Endereço da loja"
                  value={form.endereco}
                  onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
                />
              </div>
              <div className="dash-form-field">
                <label className="dash-form-label">Telefone</label>
                <input
                  className="dash-form-input"
                  type="text"
                  placeholder="Telefone"
                  value={form.telefone}
                  onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                />
              </div>
            </div>
            {erro && <p className="dash-form-erro">{erro}</p>}
            {sucesso && <p className="dash-form-sucesso">{sucesso}</p>}
            <button className="dash-form-btn" type="submit" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar Loja'}
            </button>
          </form>
        </div>
      )}

      {sucesso && !mostrarForm && <p className="dash-form-sucesso">{sucesso}</p>}

      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Lojista</th>
              {tipo === 'admin' && <th className="th-acoes">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {lojas.length === 0 ? (
              <tr><td colSpan={tipo === 'admin' ? 6 : 5} style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma loja cadastrada.</td></tr>
            ) : (
              lojas.map(l => (
                <tr key={l.id}>
                  <td className="td-id">#{l.id}</td>
                  <td>{l.nome}</td>
                  <td>{l.endereco || '—'}</td>
                  <td>{l.telefone || '—'}</td>
                  <td>{l.lojista || '—'}</td>
                  {tipo === 'admin' && (
                    <td className="td-acoes">
                      <button className="btn-acao btn-editar" title="Editar" onClick={() => abrirEditar(l)}><IcEditar /></button>
                      <button className="btn-acao btn-excluir" title="Excluir" onClick={() => { setModalExcluir(l); setErroModal('') }}><IcExcluir /></button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalExcluir && (
        <Modal titulo="Confirmar exclusão" onClose={() => setModalExcluir(null)}>
          <p className="modal-mensagem">Tem certeza que deseja excluir a loja <strong>{modalExcluir.nome}</strong>?</p>
          <p className="modal-aviso">Esta ação não pode ser desfeita.</p>
          {erroModal && <p className="modal-erro">{erroModal}</p>}
          <div className="modal-acoes">
            <button className="modal-btn-cancelar" onClick={() => setModalExcluir(null)}>Cancelar</button>
            <button className="modal-btn-excluir" onClick={handleExcluir}>Excluir</button>
          </div>
        </Modal>
      )}

      {modalEditar && (
        <Modal titulo="Editar Loja" onClose={() => setModalEditar(null)}>
          <form className="modal-form" onSubmit={handleEditar}>
            <div className="modal-field">
              <label className="modal-label">Nome *</label>
              <input className="modal-input" type="text" value={formEditar.nome} onChange={e => setFormEditar(f => ({ ...f, nome: e.target.value }))} required />
            </div>
            <div className="modal-field">
              <label className="modal-label">Usuário Lojista *</label>
              <DropdownSelect
                value={formEditar.usuario_id}
                onChange={val => setFormEditar(f => ({ ...f, usuario_id: val }))}
                options={lojistas.map(u => ({ value: u.id, label: u.nome }))}
                placeholder="Selecione o lojista"
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Endereço</label>
              <input className="modal-input" type="text" value={formEditar.endereco} onChange={e => setFormEditar(f => ({ ...f, endereco: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Telefone</label>
              <input className="modal-input" type="text" value={formEditar.telefone} onChange={e => setFormEditar(f => ({ ...f, telefone: e.target.value }))} />
            </div>
            {erroModal && <p className="modal-erro">{erroModal}</p>}
            <div className="modal-acoes">
              <button type="button" className="modal-btn-cancelar" onClick={() => setModalEditar(null)}>Cancelar</button>
              <button type="submit" className="modal-btn-salvar" disabled={carregandoModal}>{carregandoModal ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Modal>
      )}
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

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('usuario')
    sessionStorage.removeItem('tipo')
    navigate('/')
  }

  const renderConteudo = () => {
    if (secao === 'visao-geral') return <VisaoGeral />
    if (secao === 'pedidos') return <Pedidos />
    if (secao === 'usuarios') return <Usuarios tipo={tipo} />
    if (secao === 'lojas') return <Lojas tipo={tipo} />
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
