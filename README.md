# Duck — Frontend

Interface web do sistema de gestão de entregas Duck.

---

## Tecnologias

- React 19 + Vite 8
- React Router v7
- Vitest + Testing Library (testes)

---

## Pré-requisitos

- Node.js >= 20
- Backend rodando em `http://localhost:3000` (ver README do backend)

---

## Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/C14-INATEL/Reposit-rio---Frontend.git
cd Reposit-rio---Frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar em modo desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## Páginas

| Rota        | Descrição                                      |
|-------------|------------------------------------------------|
| `/`         | Login — acesso com e-mail e senha              |
| `/cadastro` | Cadastro de novo usuário (operador ou lojista) |
| `/dashboard`| Painel principal (protegido por sessão)        |

---

## Seções do Dashboard

| Seção       | Quem acessa             | Descrição                                      |
|-------------|-------------------------|------------------------------------------------|
| Visão Geral | Todos                   | Cards de resumo e pedidos recentes             |
| Pedidos     | Todos                   | Lista de pedidos com status                    |
| Usuários    | Todos (editar: admin)   | Lista de usuários; admin pode editar e excluir |
| Lojas       | Todos (cadastrar: admin)| Lista de lojas; admin pode cadastrar, editar e excluir |

---

## Credenciais de teste

| E-mail             | Senha  | Tipo     |
|--------------------|--------|----------|
| admin@email.com    | 123456 | admin    |
| op1@email.com      | 123456 | operador |
| A@email.com        | 123456 | lojista  |

> O backend com Docker deve estar rodando para o login funcionar.

---

## Rodar testes

```bash
npm test
```
