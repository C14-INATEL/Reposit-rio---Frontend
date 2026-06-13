import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../api/api'
import '../styles/Dashboard.css'

/* eslint-disable react-hooks/set-state-in-effect */

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

const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
  value,
  label: config.label,
}))

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

function Pedidos({ entregas, tipo, onStatusPedidoAlterado }) {
  const [statusSalvando, setStatusSalvando] = useState(null)

  const handleStatusChange = async (pedido, novoStatus) => {
    if (novoStatus === pedido.status) return

    setStatusSalvando(pedido.id)
    try {
      await onStatusPedidoAlterado(pedido.id, novoStatus)
    } catch (err) {
      alert('Erro ao atualizar status: ' + (err.data?.mensagem || err.message))
    } finally {
      setStatusSalvando(null)
    }
  }

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
                    {tipo === 'operador' ? (
                      <select
                        className={`status-select ${sv.classe}`}
                        value={p.status}
                        onChange={e => handleStatusChange(p, e.target.value)}
                        disabled={statusSalvando === p.id}
                        aria-label={`Status do pedido ${p.id}`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`badge ${sv.classe}`}>{sv.label}</span>
                    )}
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

// Ícones para ações
function IcEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IcDelete() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  )
}

function IcPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function IcClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function IcEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function IcEyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

// Modal de Criar/Editar Usuário
function ModalUsuario({ isOpen, modo, usuario, onClose, onSave, carregando }) {
  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    senha: '',
    tipo: usuario?.tipo || 'operador',
  })
  const [erros, setErros] = useState({})
  const [mostrarSenha, setMostrarSenha] = useState(false)

  useEffect(() => {
    if (usuario && modo === 'editar') {
      setForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        senha: '',
        tipo: usuario.tipo || 'operador',
      })
    } else {
      setForm({ nome: '', email: '', senha: '', tipo: 'operador' })
    }
    setErros({})
  }, [usuario, modo, isOpen])

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório'
    if (!form.email.trim()) novosErros.email = 'Email é obrigatório'
    if (modo === 'criar' && !form.senha) novosErros.senha = 'Senha é obrigatória'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) novosErros.email = 'Email inválido'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSave = () => {
    if (!validar()) return
    onSave(form, modo)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{modo === 'criar' ? 'Criar Novo Usuário' : 'Editar Usuário'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <IcClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome do usuário"
              disabled={carregando}
            />
            {erros.nome && <span className="error-text">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="usuario@email.com"
              disabled={carregando}
            />
            {erros.email && <span className="error-text">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label>Senha {modo === 'editar' && <span style={{ fontSize: '0.8em', color: '#888' }}>(deixar em branco para não alterar)</span>}</label>
            <div className="input-password-wrapper">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={form.senha}
                onChange={e => setForm({ ...form, senha: e.target.value })}
                placeholder={modo === 'criar' ? 'Digite uma senha' : 'Nova senha (opcional)'}
                disabled={carregando}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? 'Ocultar' : 'Mostrar'}
              >
                {mostrarSenha ? <IcEyeOff /> : <IcEye />}
              </button>
            </div>
            {erros.senha && <span className="error-text">{erros.senha}</span>}
          </div>

          <div className="form-group">
            <label>Tipo de Usuário</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} disabled={carregando}>
              <option value="admin">Admin</option>
              <option value="operador">Operador</option>
              <option value="lojista">Lojista</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={carregando}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave} disabled={carregando}>
            {carregando ? 'Salvando...' : modo === 'criar' ? 'Criar' : 'Atualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Usuarios({ usuarios, onUsuariosAlterados, tipo }) {
  const [listaUsuarios, setListaUsuarios] = useState(usuarios)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoModal, setModoModal] = useState('criar')
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [carregandoModal, setCarregandoModal] = useState(false)
  const [carregandoAcao, setCarregandoAcao] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const podeGerenciar = tipo === 'admin'

  useEffect(() => {
    setListaUsuarios(usuarios)
  }, [usuarios])

  const abrirCriar = () => {
    setModoModal('criar')
    setUsuarioSelecionado(null)
    setModalAberto(true)
  }

  const abrirEditar = (usuario) => {
    setModoModal('editar')
    setUsuarioSelecionado(usuario)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setMensagem('')
  }

  const handleSalvarUsuario = async (form, modo) => {
    setCarregandoModal(true)
    try {
      if (modo === 'criar') {
        const res = await api.post('/cadastro', form)
        setListaUsuarios([...listaUsuarios, res.usuario || { ...form, id: Date.now() }])
        setMensagem('✓ Usuário criado com sucesso!')
        setTimeout(() => fecharModal(), 1500)
      } else {
        const res = await api.put(`/usuarios/${usuarioSelecionado.id}`, form)
        const usuarioAtualizado = res.usuario || { ...usuarioSelecionado, ...form }
        setListaUsuarios(listaUsuarios.map(u => u.id === usuarioSelecionado.id ? usuarioAtualizado : u))
        setMensagem('✓ Usuário atualizado com sucesso!')
        setTimeout(() => fecharModal(), 1500)
      }
      onUsuariosAlterados()
    } catch (err) {
      setMensagem('✗ Erro: ' + (err.response?.data?.mensagem || err.message))
    } finally {
      setCarregandoModal(false)
    }
  }

  const handleExcluir = async (usuario) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) return
    
    setCarregandoAcao(usuario.id)
    try {
      await api.delete(`/usuarios/${usuario.id}`)
      setListaUsuarios(listaUsuarios.filter(u => u.id !== usuario.id))
      onUsuariosAlterados()
    } catch (err) {
      alert('Erro ao excluir: ' + (err.response?.data?.mensagem || err.message))
    } finally {
      setCarregandoAcao(null)
    }
  }

  // Apenas admin pode gerenciar usuários
  if (tipo !== 'admin' && tipo !== 'operador') {
    return (
      <div className="dash-section">
        <h2 className="dash-section-title">Usuários</h2>
        <div style={{ padding: 24, color: '#c62828' }}>
          Apenas administradores podem gerenciar usuários.
        </div>
      </div>
    )
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="dash-section-title">Usuários</h2>
        {podeGerenciar && (
        <button className="btn-novo" onClick={abrirCriar}>
          <IcPlus /> Novo Usuário
        </button>
        )}
      </div>

      {podeGerenciar && mensagem && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 4,
          backgroundColor: mensagem.includes('✓') ? '#e8f5e9' : '#ffebee',
          color: mensagem.includes('✓') ? '#2e7d32' : '#c62828',
        }}>
          {mensagem}
        </div>
      )}

      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Senha</th>
              <th>Tipo</th>
              {podeGerenciar && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {listaUsuarios.map(u => {
              const tv = tipoConfig[u.tipo] || { label: u.tipo, classe: '' }
              return (
                <tr key={u.id}>
                  <td className="td-id">#{u.id}</td>
                  <td>{u.nome}</td>
                  <td className="td-email">{u.email}</td>
                  <td style={{ fontFamily: 'monospace', color: '#666' }}>{u.senha}</td>
                  <td>
                    <span className={`badge ${tv.classe}`}>{tv.label}</span>
                  </td>
                  {podeGerenciar && (
                  <td className="td-acoes">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => abrirEditar(u)}
                      title="Editar"
                      disabled={carregandoAcao === u.id}
                    >
                      <IcEdit />
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleExcluir(u)}
                      title="Excluir"
                      disabled={carregandoAcao === u.id}
                    >
                      <IcDelete />
                    </button>
                  </td>
                  )}
                </tr>
              )
            })}
            {listaUsuarios.length === 0 && (
              <tr><td colSpan={podeGerenciar ? 6 : 5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum usuário.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {podeGerenciar && (
      <ModalUsuario
        isOpen={modalAberto}
        modo={modoModal}
        usuario={usuarioSelecionado}
        onClose={fecharModal}
        onSave={handleSalvarUsuario}
        carregando={carregandoModal}
      />
      )}
    </div>
  )
}

function ModalLoja({ isOpen, modo, loja, lojistas, onClose, onSave, carregando }) {
  const [form, setForm] = useState({
    nome: loja?.nome || '',
    endereco: loja?.endereco || '',
    telefone: loja?.telefone || '',
    usuario_id: loja?.usuario_id || '',
  })
  const [erros, setErros] = useState({})

  useEffect(() => {
    if (loja && modo === 'editar') {
      setForm({
        nome: loja.nome || '',
        endereco: loja.endereco || '',
        telefone: loja.telefone || '',
        usuario_id: loja.usuario_id || '',
      })
    } else {
      setForm({ nome: '', endereco: '', telefone: '', usuario_id: '' })
    }
    setErros({})
  }, [loja, modo, isOpen])

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome da loja é obrigatório'
    if (!form.usuario_id) novosErros.usuario_id = 'Selecione um lojista'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSave = () => {
    if (!validar()) return
    onSave({ ...form, usuario_id: Number(form.usuario_id) }, modo)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{modo === 'criar' ? 'Criar Nova Loja' : 'Editar Loja'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <IcClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Nome da Loja</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome da loja"
              disabled={carregando}
            />
            {erros.nome && <span className="error-text">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              value={form.endereco}
              onChange={e => setForm({ ...form, endereco: e.target.value })}
              placeholder="Endereço da loja"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              value={form.telefone}
              onChange={e => setForm({ ...form, telefone: e.target.value })}
              placeholder="Telefone da loja"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label>Lojista</label>
            <select
              value={form.usuario_id}
              onChange={e => setForm({ ...form, usuario_id: e.target.value })}
              disabled={carregando || lojistas.length === 0}
            >
              <option value="">Selecione um lojista</option>
              {lojistas.map(lojista => (
                <option key={lojista.id} value={lojista.id}>
                  {lojista.nome} ({lojista.email})
                </option>
              ))}
            </select>
            {lojistas.length === 0 && (
              <span className="error-text">Cadastre um usuário do tipo lojista antes de criar uma loja.</span>
            )}
            {erros.usuario_id && <span className="error-text">{erros.usuario_id}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={carregando}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave} disabled={carregando || lojistas.length === 0}>
            {carregando ? 'Salvando...' : modo === 'criar' ? 'Criar' : 'Atualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Lojas({ lojas, usuarios, onLojasAlteradas, tipo }) {
  const [listaLojas, setListaLojas] = useState(lojas)
  const [modalAberto, setModalAberto] = useState(false)
  const [modoModal, setModoModal] = useState('criar')
  const [lojaSelecionada, setLojaSelecionada] = useState(null)
  const [carregandoModal, setCarregandoModal] = useState(false)
  const [carregandoAcao, setCarregandoAcao] = useState(null)
  const [mensagem, setMensagem] = useState('')

  const podeGerenciar = tipo === 'admin'
  const lojistas = useMemo(
    () => usuarios.filter(usuario => usuario.tipo === 'lojista'),
    [usuarios]
  )

  useEffect(() => {
    setListaLojas(lojas)
  }, [lojas])

  const abrirCriar = () => {
    setModoModal('criar')
    setLojaSelecionada(null)
    setModalAberto(true)
  }

  const abrirEditar = (loja) => {
    setModoModal('editar')
    setLojaSelecionada(loja)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setMensagem('')
  }

  const handleSalvarLoja = async (form, modo) => {
    setCarregandoModal(true)
    try {
      if (modo === 'criar') {
        const res = await api.post('/lojas', form)
        setListaLojas([...listaLojas, res.loja || { ...form, id: Date.now() }])
        setMensagem('Loja criada com sucesso!')
        setTimeout(() => fecharModal(), 1500)
      } else {
        await api.put(`/lojas/${lojaSelecionada.id}`, form)
        setListaLojas(listaLojas.map(l => l.id === lojaSelecionada.id ? { ...l, ...form } : l))
        setMensagem('Loja atualizada com sucesso!')
        setTimeout(() => fecharModal(), 1500)
      }
      onLojasAlteradas()
    } catch (err) {
      setMensagem('Erro: ' + (err.data?.mensagem || err.message))
    } finally {
      setCarregandoModal(false)
    }
  }

  const handleExcluir = async (loja) => {
    if (!window.confirm(`Tem certeza que deseja excluir a loja ${loja.nome}?`)) return

    setCarregandoAcao(loja.id)
    try {
      await api.delete(`/lojas/${loja.id}`)
      setListaLojas(listaLojas.filter(l => l.id !== loja.id))
      onLojasAlteradas()
    } catch (err) {
      alert('Erro ao excluir: ' + (err.data?.mensagem || err.message))
    } finally {
      setCarregandoAcao(null)
    }
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="dash-section-title">Lojas</h2>
        {podeGerenciar && (
          <button className="btn-novo" onClick={abrirCriar}>
            <IcPlus /> Nova Loja
          </button>
        )}
      </div>

      {mensagem && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 4,
          backgroundColor: mensagem.startsWith('Erro') ? '#ffebee' : '#e8f5e9',
          color: mensagem.startsWith('Erro') ? '#c62828' : '#2e7d32',
        }}>
          {mensagem}
        </div>
      )}

      <div className="dash-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Lojista</th>
              {podeGerenciar && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {listaLojas.map(l => (
              <tr key={l.id}>
                <td className="td-id">#{l.id}</td>
                <td>{l.nome}</td>
                <td>{l.endereco}</td>
                <td>{l.telefone}</td>
                <td>{l.lojista || '-'}</td>
                {podeGerenciar && (
                  <td className="td-acoes">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => abrirEditar(l)}
                      title="Editar"
                      disabled={carregandoAcao === l.id}
                    >
                      <IcEdit />
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleExcluir(l)}
                      title="Excluir"
                      disabled={carregandoAcao === l.id}
                    >
                      <IcDelete />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {listaLojas.length === 0 && (
              <tr><td colSpan={podeGerenciar ? 6 : 5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhuma loja.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {podeGerenciar && (
        <ModalLoja
          isOpen={modalAberto}
          modo={modoModal}
          loja={lojaSelecionada}
          lojistas={lojistas}
          onClose={fecharModal}
          onSave={handleSalvarLoja}
          carregando={carregandoModal}
        />
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
  const [entregas, setEntregas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [lojas, setLojas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  const carregarDados = () => {
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
  }

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    carregarDados()
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

  const atualizarStatusPedido = async (pedidoId, status) => {
    const entregaAtualizada = await api.patch(`/entregas/${pedidoId}`, { status })
    setEntregas(entregasAtuais => entregasAtuais.map(entrega => (
      entrega.id === pedidoId ? { ...entrega, ...entregaAtualizada } : entrega
    )))
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
    if (secao === 'pedidos') return <Pedidos entregas={entregas} tipo={tipo} onStatusPedidoAlterado={atualizarStatusPedido} />
    if (secao === 'usuarios') return <Usuarios usuarios={usuarios} tipo={tipo} onUsuariosAlterados={carregarDados} />
    if (secao === 'lojas') return <Lojas lojas={lojas} usuarios={usuarios} tipo={tipo} onLojasAlteradas={carregarDados} />
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
