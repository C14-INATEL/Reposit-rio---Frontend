import { render, screen, waitFor } from '@testing-library/react'
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

  global.fetch = vi.fn().mockImplementation((url) => {
    if (typeof url === 'string') {
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
    expect(screen.getByText(/Empório Central/i)).toBeInTheDocument()
  })

})
