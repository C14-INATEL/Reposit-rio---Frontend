import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Dashboard from '../pages/Dashboard'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const real = await importOriginal()
  return { ...real, useNavigate: () => mockNavigate }
})

const renderDashboard = (tipo = 'admin') => {
  sessionStorage.setItem('usuario', 'Lucas Martins')
  sessionStorage.setItem('tipo', tipo)
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

describe('Dashboard — mock de chamadas à API', () => {

  beforeEach(() => {
    sessionStorage.clear()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /* Teste 1 — Seção Usuários */
  it('exibe lista de usuários retornada pela API ao entrar na seção Usuários', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, nome: 'Lucas Martins',   email: 'lucas.martins@duck.com',  tipo: 'admin'    },
        { id: 2, nome: 'Fernanda Lima',   email: 'fernanda.lima@duck.com',  tipo: 'operador' },
        { id: 3, nome: 'Ana Paula Santos',email: 'ana.santos@email.com',    tipo: 'lojista'  },
      ],
    })

    renderDashboard('admin')

    fireEvent.click(screen.getByRole('button', { name: /usuários/i }))

    await waitFor(() => {
      // Lucas Martins aparece 2x: no header ("Bem vindo") e na tabela
      expect(screen.getAllByText('Lucas Martins').length).toBeGreaterThanOrEqual(2)
      expect(screen.getByText('Fernanda Lima')).toBeInTheDocument()
      expect(screen.getByText('Ana Paula Santos')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/usuarios')
  })

  /* Teste 2 — Seção Lojas  */
  it('exibe lista de lojas retornada pela API ao entrar na seção Lojas', async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/lojas')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, nome: 'Empório Central',   endereco: 'Av. Paulista, 1842', telefone: '11 93271-4455', lojista: 'Ana Paula Santos' },
            { id: 2, nome: 'Farmácia Saúde Já', endereco: 'Rua Augusta, 374',   telefone: '11 97834-2210', lojista: 'Roberto Campos'    },
          ],
        })
      }
      // chamada secundária: lista de lojistas para o dropdown
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    })

    renderDashboard('admin')

    fireEvent.click(screen.getByRole('button', { name: /lojas/i }))

    await waitFor(() => {
      expect(screen.getByText('Empório Central')).toBeInTheDocument()
      expect(screen.getByText('Farmácia Saúde Já')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/lojas')
  })

})
