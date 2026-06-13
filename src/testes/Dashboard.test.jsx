import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const entregasMock = [
  {
    id: 10, descricao: 'Pedido alfa', status: 'criado', prioridade: 'alta',
    data_pedido: '2026-06-01T12:00:00Z', data_entrega: null, custo: '30.00',
    loja_id: 1, loja_nome: 'Empório Central', lojista_id: 4,
    regiao_id: 1, regiao_nome: 'Sul', regiao_custo_base: '20.00',
  },
]

const usuariosMock = [
  { id: 1, nome: 'Admin Duck', email: 'admin@duck.com', tipo: 'admin' },
  { id: 4, nome: 'Lojista 1', email: 'l1@duck.com', tipo: 'lojista' },
]

const lojasMock = [
  { id: 1, nome: 'Empório Central', endereco: 'Av. Paulista', telefone: '11999999999', lojista: 'Lojista 1', usuario_id: 4 },
]

function ok(data) {
  return Promise.resolve({ ok: true, json: async () => data })
}

beforeEach(() => {
  sessionStorage.clear()
  sessionStorage.setItem('usuario', 'Admin Duck')
  sessionStorage.setItem('tipo', 'admin')

  globalThis.fetch = vi.fn().mockImplementation((url, options = {}) => {
    if (typeof url === 'string') {
      if (url.includes('/entregas/10') && options.method === 'PATCH') {
        return ok({ ...entregasMock[0], status: 'enviado' })
      }
      if (url.includes('/lojas') && options.method === 'POST') {
        return ok({
          mensagem: 'Loja criada com sucesso',
          loja: {
            id: 2,
            nome: 'Loja Nova',
            endereco: 'Rua Nova, 123',
            telefone: '11988887777',
            usuario_id: 4,
          },
        })
      }
      if (url.includes('/entregas')) return ok(entregasMock)
      if (url.includes('/usuarios')) return ok(usuariosMock)
      if (url.includes('/lojas')) return ok(lojasMock)
    }
    return ok([])
  })
})

describe('Dashboard (admin)', () => {

  it('mostra estado de carregamento e depois renderiza os dados vindos do backend', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    // Estado inicial — carregando
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()

    // Depois das chamadas mockadas resolverem, dados aparecem
    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    // Card "Total de Pedidos" deve refletir os dados mockados (1 entrega)
    expect(screen.getByText(/Total de Pedidos/i)).toBeInTheDocument()
    // Loja mockada aparece na tabela
    expect(screen.getByText(/Central/i)).toBeInTheDocument()
  })

  it('permite ao admin criar loja selecionando um lojista existente', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lojas/i }))
    await user.click(screen.getByRole('button', { name: /Nova Loja/i }))

    await user.type(screen.getByPlaceholderText(/Nome da loja/i), 'Loja Nova')
    await user.type(screen.getByPlaceholderText(/Endereço da loja/i), 'Rua Nova, 123')
    await user.type(screen.getByPlaceholderText(/Telefone da loja/i), '11988887777')
    await user.selectOptions(screen.getByRole('combobox'), '4')
    await user.click(screen.getByRole('button', { name: /^Criar$/i }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/lojas'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            nome: 'Loja Nova',
            endereco: 'Rua Nova, 123',
            telefone: '11988887777',
            usuario_id: 4,
          }),
        })
      )
    })
  })

  it('permite ao operador alterar o status do pedido salvando no backend', async () => {
    sessionStorage.setItem('tipo', 'operador')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Pedidos/i }))
    await user.selectOptions(screen.getByLabelText(/Status do pedido 10/i), 'enviado')

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/entregas/10'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'enviado' }),
        })
      )
    })
  })

  it('permite ao operador visualizar lojas sem acoes de gerenciamento', async () => {
    sessionStorage.setItem('tipo', 'operador')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lojas/i }))

    expect(screen.getByText(/Central/i)).toBeInTheDocument()
    expect(screen.getByText(/Lojista 1/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Nova Loja/i })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument()
  })

  it('permite ao operador visualizar usuarios sem acoes de gerenciamento', async () => {
    sessionStorage.setItem('tipo', 'operador')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Usu.*rios/i }))

    expect(screen.getAllByText(/Admin Duck/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Lojista 1/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Novo/i })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument()
  })

  it('permite ao admin criar loja selecionando um lojista existente', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lojas/i }))
    await user.click(screen.getByRole('button', { name: /Nova Loja/i }))

    await user.type(screen.getByPlaceholderText(/Nome da loja/i), 'Loja Nova')
    await user.type(screen.getByPlaceholderText(/Endere/i), 'Rua Nova, 123')
    await user.type(screen.getByPlaceholderText(/Telefone da loja/i), '11988887777')
    await user.selectOptions(screen.getByRole('combobox'), '4')
    await user.click(screen.getByRole('button', { name: /^Criar$/i }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/lojas'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            nome: 'Loja Nova',
            endereco: 'Rua Nova, 123',
            telefone: '11988887777',
            usuario_id: 4,
          }),
        })
      )
    })
  })

  it('permite ao operador alterar o status do pedido', async () => {
    sessionStorage.setItem('tipo', 'operador')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Pedidos/i }))
    await user.selectOptions(screen.getByLabelText(/Status do pedido 10/i), 'enviado')

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/entregas/10'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'enviado' }),
        })
      )
    })
  })

})
