import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../pages/Login'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const real = await importOriginal()
  return { ...real, useNavigate: () => mockNavigate }
})

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

describe('Tela de Login', () => {

  beforeEach(() => {
    mockNavigate.mockClear()
    sessionStorage.clear()
  })

  it('renderiza os campos de usuário, senha e botão de entrar', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('navega para o dashboard ao usar credenciais mock válidas', async () => {
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('Digite seu usuário'), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: '1234' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/dashboard',
        expect.objectContaining({ state: expect.objectContaining({ usuario: 'admin' }) })
      )
    })
  })

  it('exibe mensagem de erro ao usar credenciais inválidas sem backend', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ mensagem: 'Usuário ou senha incorretos.' }),
    })

    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('Digite seu usuário'), {
      target: { value: 'errado' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'errado' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Usuário ou senha incorretos.')).toBeInTheDocument()
    })
  })

})
