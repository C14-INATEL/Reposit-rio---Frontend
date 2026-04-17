import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const real = await importOriginal()
  return { ...real, useNavigate: () => mockNavigate }
})

describe('Dashboard — mock de chamadas à API', () => {

  beforeEach(() => {
    sessionStorage.clear()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * Teste 1 — Login via backend com mock do fetch
   *
   * Cenário: usuário preenche credenciais que NÃO estão no MOCK_USERS local
   * do componente (ex: 'fernanda' / 'senha123'). O componente cai no bloco
   * de fetch real. Mockamos o fetch para simular uma resposta bem-sucedida
   * do backend, retornando tipo 'operador'.
   *
   * Por que mock é necessário aqui?
   * O componente depende do backend para autenticar usuários reais.
   * Com o mock do fetch isolamos essa dependência — o teste roda sem
   * nenhum servidor rodando e valida que o componente redireciona
   * corretamente ao receber uma resposta positiva da API.
   */
  it('redireciona para o dashboard ao autenticar via backend com mock do fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tipo: 'operador' }),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Digite seu usuário'), {
      target: { value: 'fernanda' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/dashboard',
        expect.objectContaining({ state: expect.objectContaining({ tipo: 'operador' }) })
      )
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/login',
      expect.objectContaining({ method: 'POST' })
    )
  })

  /**
   * Teste 2 — Dashboard redireciona quando não autenticado
   *
   * Cenário: sessionStorage está vazio (usuário não fez login).
   * O Dashboard verifica a sessão no useEffect e deve chamar navigate('/')
   * para redirecionar ao login.
   *
   * Por que mock é necessário aqui?
   * useNavigate é mockado para capturar a chamada de redirect sem precisar
   * de um router real ou navegar de fato entre páginas. Isso isola o
   * comportamento de proteção de rota do Dashboard de qualquer
   * infraestrutura de navegação externa.
   */
  it('redireciona para a tela de login quando sessionStorage está vazio', () => {
    // sessionStorage limpo — usuário não autenticado
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

})
