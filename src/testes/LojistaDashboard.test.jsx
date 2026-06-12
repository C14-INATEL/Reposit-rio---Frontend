import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LojistaDashboard from '../pages/LojistaDashboard'

const lojasMock = [
  { id: 1, nome: 'Loja A', endereco: 'Rua X, 100', telefone: '11999999999', usuario_id: 4, lojista: 'Loja A' },
]

const regioesMock = [
  { id: 1, nome: 'Sul',     custo_base: '20.00' },
  { id: 2, nome: 'Sudeste', custo_base: '25.00' },
]

const entregasMock = [
  {
    id: 1, descricao: 'Pedido teste', status: 'criado', prioridade: 'media',
    data_pedido: '2026-06-01T12:00:00Z', data_entrega: null, custo: '20.00',
    loja_id: 1, loja_nome: 'Loja A', lojista_id: 4,
    regiao_id: 1, regiao_nome: 'Sul', regiao_custo_base: '20.00',
  },
  {
    id: 2, descricao: 'Pedido entregue', status: 'entregue', prioridade: 'urgente',
    data_pedido: '2026-05-30T12:00:00Z', data_entrega: '2026-06-01T12:00:00Z', custo: '37.50',
    loja_id: 1, loja_nome: 'Loja A', lojista_id: 4,
    regiao_id: 2, regiao_nome: 'Sudeste', regiao_custo_base: '25.00',
  },
]

function ok(data) {
  return Promise.resolve({ ok: true, json: async () => data })
}

function mockFetchPadrao() {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (typeof url === 'string') {
      if (url.includes('/regioes')) return ok(regioesMock)
      if (url.includes('/lojas')) return ok(lojasMock)
      if (url.includes('/entregas')) return ok(entregasMock)
    }
    return ok([])
  })
}

beforeEach(() => {
  sessionStorage.clear()
  sessionStorage.setItem('usuario', 'Loja A')
  sessionStorage.setItem('tipo', 'lojista')
  sessionStorage.setItem('userId', '4')
  mockFetchPadrao()
})

describe('LojistaDashboard', () => {

  it('renderiza o header com o nome do usuário', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText(/Bem vindo/i)).toBeInTheDocument()
    expect(screen.getByText(/Loja A/i)).toBeInTheDocument()
  })

  it('renderiza os cards de resumo após carregar os dados', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Total de Pedidos/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Pendentes/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Em Rota/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Entregues/i)).toBeInTheDocument()
  })

  it('renderiza a tabela de pedidos recentes com colunas do schema novo', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })
    expect(screen.getAllByText(/Descrição/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Região/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Prioridade/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Status/i)[0]).toBeInTheDocument()
  })

  it('navega para a seção Pedidos ao clicar no menu', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    const menuPedidos = screen.getAllByRole('button', { name: /pedidos/i })[0]
    fireEvent.click(menuPedidos)

    expect(screen.getByText(/Meus Pedidos/i)).toBeInTheDocument()
  })

  it('abre o formulário ao clicar em Novo Pedido', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    const btnNovo = screen.getAllByRole('button', { name: /novo pedido/i })[0]
    fireEvent.click(btnNovo)

    expect(screen.getAllByText(/Novo Pedido/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Descrição/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Região/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Prioridade/i).length).toBeGreaterThan(0)
  })

  it('fecha o formulário ao clicar em Cancelar', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    const btnNovo = screen.getAllByRole('button', { name: /novo pedido/i })[0]
    fireEvent.click(btnNovo)

    expect(screen.getByText(/Custo estimado/i)).toBeInTheDocument()

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(btnCancelar)

    expect(screen.queryByText(/Custo estimado/i)).not.toBeInTheDocument()
  })

  it('botão Criar Pedido fica desabilitado sem preencher os campos obrigatórios', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    const btnNovo = screen.getAllByRole('button', { name: /novo pedido/i })[0]
    fireEvent.click(btnNovo)

    const btnCriar = screen.getByRole('button', { name: /criar pedido/i })
    expect(btnCriar).toBeDisabled()
  })

  it('recolhe e expande a sidebar ao clicar no toggle', async () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    const toggle = document.querySelector('.dash-sidebar-toggle')
    fireEvent.click(toggle)

    const sidebar = document.querySelector('.dash-sidebar')
    expect(sidebar.classList.contains('recolhida')).toBe(true)

    fireEvent.click(toggle)
    expect(sidebar.classList.contains('recolhida')).toBe(false)
  })

  it('redireciona para home ao clicar em Sair', async () => {
    render(
      <MemoryRouter initialEntries={['/lojista']}>
        <Routes>
          <Route path="/lojista" element={<LojistaDashboard />} />
          <Route path="/" element={<h1>Tela Home</h1>} />
        </Routes>
      </MemoryRouter>
    )

    const btnSair = screen.getByRole('button', { name: /sair/i })
    fireEvent.click(btnSair)

    expect(screen.getByText(/Tela Home/i)).toBeInTheDocument()
  })

  // --- NOVO ---
  it('exibe mensagem de empty state quando o lojista não tem lojas cadastradas', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (typeof url === 'string') {
        if (url.includes('/lojas')) return ok([])
        if (url.includes('/regioes')) return ok(regioesMock)
        if (url.includes('/entregas')) return ok([])
      }
      return ok([])
    })

    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/não tem lojas cadastradas/i)).toBeInTheDocument()
    })
  })

  // --- NOVO ---
  it('cancela um pedido com status criado chamando PATCH /entregas/:id', async () => {
    let patchChamado = false
    global.fetch = vi.fn().mockImplementation((url, opts) => {
      if (typeof url === 'string') {
        if (url.includes('/regioes')) return ok(regioesMock)
        if (url.includes('/lojas')) return ok(lojasMock)
        if (url.endsWith('/entregas/1') && opts && opts.method === 'PATCH') {
          patchChamado = true
          return ok({ ...entregasMock[0], status: 'cancelado' })
        }
        if (url.includes('/entregas')) return ok(entregasMock)
      }
      return ok([])
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    // Ir para a aba Pedidos onde aparecem os botões de Cancelar
    const menuPedidos = screen.getAllByRole('button', { name: /pedidos/i })[0]
    fireEvent.click(menuPedidos)

    await waitFor(() => {
      expect(screen.getByText(/Meus Pedidos/i)).toBeInTheDocument()
    })

    const btnCancelar = screen.getAllByRole('button', { name: /^cancelar$/i })[0]
    fireEvent.click(btnCancelar)

    await waitFor(() => {
      expect(patchChamado).toBe(true)
    })
  })

})
