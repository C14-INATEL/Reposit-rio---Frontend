import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Rastreio.css'

const pedidosMock = [
  {
    id: 1,
    rastreio: 'TRK-ABC123XYZ-1A2B',
    lojista: 'Loja Sul Ltda',
    regiao: 'Sul',
    peso: 10.5,
    tipo: 'Urgente',
    status: 2,
    data: '05/04/2026',
    custo: 52.50
  },
  {
    id: 2,
    rastreio: 'TRK-DEF456UVW-3C4D',
    lojista: 'Tech Norte Comércio',
    regiao: 'Norte',
    peso: 5.2,
    tipo: 'Normal',
    status: 1,
    data: '04/04/2026',
    custo: 39.00
  }
]

const statusConfig = {
  1: { label: 'Pendente',  classe: 'status-pendente',  cor: '#c47f00' },
  2: { label: 'Em Rota',   classe: 'status-emrota',    cor: '#f0a500' },
  3: { label: 'Entregue',  classe: 'status-entregue',  cor: '#2e7d32' },
  4: { label: 'Cancelado', classe: 'status-cancelado', cor: '#c62828' }
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

function Rastreio() {
  const navigate = useNavigate()
  const [rastreioInput, setRastreioInput] = useState('')
  const [pedido, setPedido] = useState(null)
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)

  const buscarPedido = () => {
    setErro('')
    setPedido(null)
    const codigo = rastreioInput.toUpperCase().trim()
    if (!codigo) {
      setErro('Digite o código de rastreio.')
      return
    }
    const encontrado = pedidosMock.find(p => p.rastreio === codigo)
    if (encontrado) {
      setPedido(encontrado)
    } else {
      setErro('Código de rastreio não encontrado.')
    }
  }

  const copiar = () => {
    navigator.clipboard.writeText(pedido.rastreio)
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
              placeholder="Ex: TRK-ABC123XYZ-1A2B"
              value={rastreioInput}
              onChange={(e) => setRastreioInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarPedido()}
            />
            <button className="rastreio-btn-buscar" onClick={buscarPedido}>
              <IcBusca />
              Buscar
            </button>
          </div>

          {erro && <div className="rastreio-erro">{erro}</div>}
        </div>

        {/* RESULTADO */}
        {pedido && (
          <div className="rastreio-resultado">

            {/* STATUS */}
            <div className="rastreio-status-card">
              <div className={`rastreio-status-badge ${statusConfig[pedido.status].classe}`}>
                {statusConfig[pedido.status].label}
              </div>
              <div className="rastreio-status-info">
                <span className="rastreio-codigo-label">Código de rastreio</span>
                <div className="rastreio-codigo-row">
                  <strong className="rastreio-codigo">{pedido.rastreio}</strong>
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
                    <th>Lojista</th>
                    <th>Região</th>
                    <th>Peso</th>
                    <th>Tipo</th>
                    <th>Custo</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-id">#{pedido.id}</td>
                    <td>{pedido.lojista}</td>
                    <td>{pedido.regiao}</td>
                    <td>{pedido.peso}kg</td>
                    <td>
                      <span className={`badge tipo-${pedido.tipo.toLowerCase()}`}>
                        {pedido.tipo}
                      </span>
                    </td>
                    <td>R$ {pedido.custo.toFixed(2)}</td>
                    <td className="td-data">{pedido.data}</td>
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