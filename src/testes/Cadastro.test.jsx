import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Cadastro from '../pages/Cadastro'

const renderCadastro = () =>
  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>
  )

describe('Tela de Cadastro', () => {

  it('exibe erro quando as senhas não coincidem', async () => {
    renderCadastro()

    fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mín. 6 caracteres'), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), {
      target: { value: 'senha456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument()
    })
  })

  it('exibe erro quando a senha tem menos de 6 caracteres', async () => {
    renderCadastro()

    fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mín. 6 caracteres'), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), {
      target: { value: '123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(
        screen.getByText('A senha deve ter pelo menos 6 caracteres.')
      ).toBeInTheDocument()
    })
  })

  it('exibe erro quando nenhum tipo de conta é selecionado', async () => {
    renderCadastro()

    fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mín. 6 caracteres'), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), {
      target: { value: 'senha123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByText('Selecione um tipo de conta.')).toBeInTheDocument()
    })
  })

  it('exibe mensagem de sucesso após preencher tudo corretamente', async () => {
    renderCadastro()

    fireEvent.change(screen.getByPlaceholderText('Digite seu nome completo'), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mín. 6 caracteres'), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repita sua senha'), {
      target: { value: 'senha123' },
    })

    fireEvent.click(screen.getByText('Selecione o tipo de conta'))
    fireEvent.click(screen.getByText('Operador'))

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Cadastro realizado com sucesso! Redirecionando...')
      ).toBeInTheDocument()
    }, { timeout: 2000 })
  })

})
