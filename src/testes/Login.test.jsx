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

    expect(screen.getByPlaceholderText(/Digite seu e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('navega para o dashboard quando o backend autentica um admin', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mensagem: 'Login realizado com sucesso', tipo: 'admin' }),
    })

    renderLogin()

    fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
      target: { value: 'admin@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/dashboard',
        expect.objectContaining({
          state: expect.objectContaining({ usuario: 'admin@email.com', tipo: 'admin' }),
        })
      )
    })
  })

  it('navega para a tela de lojista quando o backend autentica um lojista', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mensagem: 'Login realizado com sucesso', tipo: 'lojista' }),
    })

    renderLogin()

    fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
      target: { value: 'ana.santos@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/lojista',
        expect.objectContaining({
          state: expect.objectContaining({ usuario: 'ana.santos@email.com', tipo: 'lojista' }),
        })
      )
    })
  })

  it('exibe mensagem de erro quando o backend rejeita as credenciais', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ mensagem: 'Usuário ou senha incorretos.' }),
    })

    renderLogin()

    fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
      target: { value: 'errado@email.com' },
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
