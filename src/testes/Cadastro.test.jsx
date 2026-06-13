import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Cadastro from '../pages/Cadastro'

const renderCadastro = () =>
  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )

function preencherForm({
  nome = 'Joao Silva',
  email = 'joao@email.com',
  senha = 'senha123',
  confirmar = 'senha123',
} = {}) {
  fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), { target: { value: nome } })
  fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), { target: { value: email } })
  fireEvent.change(screen.getByPlaceholderText(/6 caracteres/i), { target: { value: senha } })
  fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), { target: { value: confirmar } })
}

describe('Tela de Cadastro', () => {
  beforeEach(() => {
    globalThis.fetch = undefined
  })

  it('exibe erro quando as senhas nao coincidem', async () => {
    renderCadastro()
    preencherForm({ confirmar: 'senha456' })
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/As senhas.*coincidem/i)).toBeInTheDocument()
    })
  })

  it('exibe erro quando a senha tem menos de 6 caracteres', async () => {
    renderCadastro()
    preencherForm({ senha: '123', confirmar: '123' })
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/A senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument()
    })
  })

  it('exibe erro quando nenhum tipo de conta e selecionado', async () => {
    renderCadastro()
    preencherForm()
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/Selecione um tipo de conta/i)).toBeInTheDocument()
    })
  })

  it('exibe mensagem de sucesso quando o backend confirma o cadastro', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mensagem: 'Usuario cadastrado com sucesso', usuario: { id: 99, tipo: 'operador' } }),
    })

    renderCadastro()
    preencherForm()

    fireEvent.click(screen.getByText('Selecione o tipo de conta'))
    fireEvent.click(screen.getByText('Operador'))

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/Cadastro realizado com sucesso/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('envia tipo lojista ao criar uma conta de lojista', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mensagem: 'Usuario cadastrado com sucesso', usuario: { id: 100, tipo: 'lojista' } }),
    })

    renderCadastro()
    preencherForm({
      nome: 'Lojista Teste',
      email: 'lojista@email.com',
    })

    fireEvent.click(screen.getByText('Selecione o tipo de conta'))
    fireEvent.click(screen.getByText('Lojista'))

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cadastro'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            nome: 'Lojista Teste',
            email: 'lojista@email.com',
            senha: 'senha123',
            tipo: 'lojista',
          }),
        })
      )
    })
  })

  it('exibe mensagem de erro quando o backend rejeita email ja cadastrado', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ mensagem: 'Este e-mail ja esta em uso.' }),
    })

    renderCadastro()
    preencherForm({ email: 'duplicado@email.com' })

    fireEvent.click(screen.getByText('Selecione o tipo de conta'))
    fireEvent.click(screen.getByText('Operador'))

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/Este e-mail ja esta em uso/i)).toBeInTheDocument()
    })
  })
})
