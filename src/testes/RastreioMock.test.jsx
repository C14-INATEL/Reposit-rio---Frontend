import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Rastreio from '../pages/Rastreio'

// MOCK do useNavigate
const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const entregaMock = {
  id: 1,
  descricao: 'Pedido teste',
  status: 'andamento',
  prioridade: 'urgente',
  data_pedido: '2026-06-01T12:00:00Z',
  data_entrega: null,
  custo: '37.50',
  loja_id: 1,
  loja_nome: 'Loja A',
  lojista_id: 4,
  regiao_id: 2,
  regiao_nome: 'Sudeste',
  regiao_custo_base: '25.00',
}

function ok(data) {
  return Promise.resolve({ ok: true, json: async () => data })
}

function notFound() {
  return Promise.resolve({ ok: false, status: 404, json: async () => ({ mensagem: 'Entrega não encontrada' }) })
}

describe('Rastreio - Testes com Mock', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => entregaMock,
    })
  })

  // TESTE 1 — MOCK DO CLIPBOARD
  it('deve copiar o código de rastreio ao clicar no botão', async () => {
    const writeTextMock = vi.fn()
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    )

    // Digita um código válido (formato DUCK-)
    const input = screen.getByPlaceholderText(/ex:/i)
    fireEvent.change(input, { target: { value: 'DUCK-00001' } })

    // Clica em buscar
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    // Espera o resultado aparecer e clica no botão de copiar
    const btnCopiar = await screen.findByTitle(/copiar código/i)
    fireEvent.click(btnCopiar)

    // Verifica se chamou o clipboard com o código formatado
    expect(writeTextMock).toHaveBeenCalledWith('DUCK-00001')
  })

  // TESTE 2 — MOCK DO NAVIGATE
  it('deve redirecionar para home ao clicar em Voltar', () => {
    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    )

    const btnVoltar = screen.getByRole('button', { name: /voltar/i })
    fireEvent.click(btnVoltar)

    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  // --- NOVO ---
  it('exibe erro quando o backend retorna 404 para o código de rastreio', async () => {
    global.fetch = vi.fn().mockImplementation(() => notFound())

    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/ex:/i)
    fireEvent.change(input, { target: { value: 'DUCK-99999' } })

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText(/não encontrado/i)).toBeInTheDocument()
    })
  })

  // --- NOVO ---
  it('aceita input numérico simples (sem prefixo DUCK-) e busca o pedido', async () => {
    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/ex:/i)
    fireEvent.change(input, { target: { value: '1' } })

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    // Resultado tem que aparecer com o código formatado e a descrição da entrega
    expect(await screen.findByText('DUCK-00001')).toBeInTheDocument()
    expect(screen.getByText(/Pedido teste/i)).toBeInTheDocument()
  })

})
