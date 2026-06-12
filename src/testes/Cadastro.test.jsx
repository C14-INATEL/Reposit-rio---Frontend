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

function preencherForm({ nome = 'João Silva', email = 'joao@email.com', senha = 'senha123', confirmar = 'senha123' } = {}) {
  fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), { target: { value: nome } })
  fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), { target: { value: email } })
  fireEvent.change(screen.getByPlaceholderText('Mín. 6 caracteres'), { target: { value: senha } })
  fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), { target: { value: confirmar } })
}

describe('Tela de Cadastro', () => {

  beforeEach(() => {
    // Reset do fetch — cada teste configura o seu se precisar
    global.fetch = undefined
  })

  it('exibe erro quando as senhas não coincidem', async () => {
    renderCadastro()
    preencherForm({ confirmar: 'senha456' })
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument()
    })
  })

  it('exibe erro quando a senha tem menos de 6 caracteres', async () => {
    renderCadastro()
    preencherForm({ senha: '123', confirmar: '123' })
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument()
    })
  })

  it('exibe erro quando nenhum tipo de conta é selecionado', async () => {
    renderCadastro()
    preencherForm()
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText('Selecione um tipo de conta.')).toBeInTheDocument()
    })
  })

  it('exibe mensagem de sucesso quando o backend confirma o cadastro', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mensagem: 'Usuário cadastrado com sucesso', usuario: { id: 99, tipo: 'operador' } }),
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

  it('exibe mensagem de erro quando o backend rejeita e-mail já cadastrado', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ mensagem: 'Este e-mail já está em uso.' }),
    })

    renderCadastro()
    preencherForm({ email: 'duplicado@email.com' })

    fireEvent.click(screen.getByText('Selecione o tipo de conta'))
    fireEvent.click(screen.getByText('Operador'))

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText(/Este e-mail já está em uso/i)).toBeInTheDocument()
    })
  })

})
