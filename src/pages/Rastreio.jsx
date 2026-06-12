import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import '../styles/Rastreio.css'

const statusConfig = {
  criado:    { label: 'Pendente',  classe: 'status-pendente',  cor: '#c47f00' },
  andamento: { label: 'Em rota',   classe: 'status-emrota',    cor: '#f0a500' },
  enviado:   { label: 'Em rota',   classe: 'status-emrota',    cor: '#f0a500' },
  entregue:  { label: 'Entregue',  classe: 'status-entregue',  cor: '#2e7d32' },
  cancelado: { label: 'Cancelado', classe: 'status-cancelado', cor: '#c62828' },
}

function statusVisual(status) {
  return statusConfig[status] || { label: status, classe: '' }
}

function codigoRastreio(id) {
  return `DUCK-${String(id).padStart(5, '0')}`
}

function formatarData(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

function IcBusca() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function IcVoltar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

// Aceita códigos no formato DUCK-00001 ou simplesmente o número da entrega
function extrairIdRastreio(input) {
  const limpo = input.trim().toUpperCase()
  if (!limpo) return null
  const semPrefixo = limpo.replace(/^DUCK-/, '').replace(/^0+/, '')
  const id = Number(semPrefixo)
  return Number.isInteger(id) && id > 0 ? id : null
}

function Rastreio() {
  const navigate = useNavigate()
  const [rastreioInput, setRastreioInput] = useState('')
  const [pedido, setPedido] = useState(null)
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const buscarPedido = async () => {
    setErro('')
    setPedido(null)
    const id = extrairIdRastreio(rastreioInput)
    if (id === null) {
      setErro('Digite um código de rastreio válido (ex: DUCK-00001 ou 1).')
      return
    }
    setCarregando(true)
    try {
      const data = await api.get(`/entregas/${id}`)
      setPedido(data)
    } catch (err) {
      if (err.status === 404) {
        setErro('Código de rastreio não encontrado.')
      } else {
        setErro(err.message || 'Erro ao buscar pedido.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const copiar = () => {
    navigator.clipboard.writeText(codigoRastreio(pedido.id))
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="rastreio-container">

      {/* HEADER igual ao padrão do projeto */}
      <header className="rastreio-header">
        <div className="rastreio-logo">
          <img
            src="/duck-logo.png"
            alt="Duck Logo"
            className="rastreio-logo-img"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className="rastreio-logo-name">Duck</span>
        </div>

        <div className="rastreio-header-center">
          <span>Rastreio de Pedido</span>
        </div>

        <button className="rastreio-btn-voltar" onClick={() => navigate('/')}>
          <IcVoltar />
          Voltar
        </button>
      </header>

      {/* BODY */}
      <main className="rastreio-main">

        {/* CARD DE BUSCA */}
        <div className="rastreio-card">
          <h2 className="rastreio-card-title">Acompanhe sua entrega</h2>
          <p className="rastreio-card-sub">Digite o código de rastreio para consultar o status do pedido.</p>

          <div className="rastreio-input-group">
            <input
              type="text"
              className="rastreio-input"
              placeholder="Ex: DUCK-00001"
              value={rastreioInput}
              onChange={(e) => setRastreioInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarPedido()}
            />
            <button className="rastreio-btn-buscar" onClick={buscarPedido} disabled={carregando}>
              <IcBusca />
              {carregando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {erro && <div className="rastreio-erro">{erro}</div>}
        </div>

        {/* RESULTADO */}
        {pedido && (
          <div className="rastreio-resultado">

            {/* STATUS */}
            <div className="rastreio-status-card">
              <div className={`rastreio-status-badge ${statusVisual(pedido.status).classe}`}>
                {statusVisual(pedido.status).label}
              </div>
              <div className="rastreio-status-info">
                <span className="rastreio-codigo-label">Código de rastreio</span>
                <div className="rastreio-codigo-row">
                  <strong className="rastreio-codigo">{codigoRastreio(pedido.id)}</strong>
                  <button className="btn-copiar" onClick={copiar} title="Copiar código">
                    {copiado ? '✓' : '⎘'}
                  </button>
                </div>
              </div>
            </div>

            {/* TABELA DE DETALHES igual ao padrão admin */}
            <div className="dash-table-box">
              <div className="dash-table-title" style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f0f0f0' }}>
                Detalhes do Pedido
              </div>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Loja</th>
                    <th>Região</th>
                    <th>Descrição</th>
                    <th>Prioridade</th>
                    <th>Custo</th>
                    <th>Data Pedido</th>
                    <th>Data Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-id">#{pedido.id}</td>
                    <td>{pedido.loja_nome}</td>
                    <td>{pedido.regiao_nome}</td>
                    <td>{pedido.descricao}</td>
                    <td>
                      <span className={`badge tipo-${pedido.prioridade === 'urgente' ? 'urgente' : 'normal'}`}>
                        {pedido.prioridade}
                      </span>
                    </td>
                    <td>R$ {Number(pedido.custo || 0).toFixed(2)}</td>
                    <td className="td-data">{formatarData(pedido.data_pedido)}</td>
                    <td className="td-data">{formatarData(pedido.data_entrega)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default Rastreio
