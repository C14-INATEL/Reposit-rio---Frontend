# Duck — Centro de Distribuição (Frontend)

Aplicação React + Vite para gerenciamento de operações de entrega, com suporte a múltiplos perfis de usuário (admin, operador, lojista) e rastreio público de pedidos.

---

## Sumário

- [Requisitos](#requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação e execução local](#instalação-e-execução-local)
- [Testes](#testes)
- [Build de produção](#build-de-produção)
- [Docker](#docker)
- [Docker Compose (stack completa)](#docker-compose-stack-completa)
- [Jenkins (CI/CD)](#jenkins-cicd)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas da aplicação](#rotas-da-aplicação)

---

## Requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 20 |
| npm | 9 |
| Git | qualquer |
| Docker | 24 (opcional) |
| Docker Compose | v2 (opcional) |
| Jenkins | 2.x (opcional) |

---

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base do backend | `http://localhost:3000` |

> Em containers Docker o valor deve ser `http://backend:3000` (nome do serviço na rede interna). O arquivo `.env.docker` já contém esse valor.

---

## Instalação e execução local

```bash
# 1. Clone o repositório
git clone https://github.com/C14-INATEL/Reposit-rio---Frontend.git
cd Reposit-rio---Frontend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de ambiente
cp .env.example .env
# Edite VITE_API_URL se o backend rodar em outro endereço

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

---

## Testes

```bash
# Executa todos os testes uma única vez (modo CI)
npm test

# Executa os testes em modo watch (desenvolvimento)
npm run test:watch
```

Os testes utilizam **Vitest** + **Testing Library** com ambiente `jsdom`. O arquivo de setup está em `src/testes/setup.js`.

---

## Build de produção

```bash
npm run build
```

Os artefatos são gerados na pasta `dist/`.

---

## Docker

### Build da imagem

```bash
docker build -t duck-frontend .
```

### Executar o container isolado

```bash
docker run -d \
  --name frontend \
  -p 5173:5173 \
  -e VITE_API_URL=http://localhost:3000 \
  duck-frontend
```

Acesse em `http://localhost:5173`.

> **Atenção:** ao rodar o frontend isoladamente, certifique-se de que o backend já está acessível no endereço configurado em `VITE_API_URL`.

---

## Docker Compose (stack completa)

O arquivo `docker-compose.yml` na raiz do monorepo **DUCK** sobe os três serviços juntos: banco de dados PostgreSQL, backend e frontend.

### Pré-requisitos

- O repositório do backend deve estar clonado em `./Reposit-rio---backend/app_backend` (caminho esperado pelo Compose).

### Subir a stack

```bash
# No diretório raiz que contém o docker-compose.yml
docker compose up -d --build
```

### Parar a stack

```bash
docker compose down
```

### Parar e remover volumes (reset total do banco)

```bash
docker compose down -v
```

### Serviços e portas

| Serviço | Porta | Descrição |
|---|---|---|
| `db` | 5432 | PostgreSQL 15 |
| `backend` | 3000 | API Node.js |
| `frontend` | 5173 | React + Vite |

### Variáveis injetadas pelo Compose

O Compose já injeta `VITE_API_URL=http://backend:3000` no container do frontend, apontando para o serviço backend pela rede interna do Docker. Não é necessário editar nenhum `.env` para esse modo de execução.

### Verificar logs

```bash
# Todos os serviços
docker compose logs -f

# Apenas o frontend
docker compose logs -f frontend
```

---

## Jenkins (CI/CD)

O `Jenkinsfile` na raiz define um pipeline com os seguintes estágios:

| Estágio | O que faz |
|---|---|
| **Checkout** | Clona/atualiza o código via SCM |
| **Instalar dependências** | Executa `npm install` |
| **Rodar testes** | Executa `npm test` |
| **Build** | Executa `npm run build` |
| **Deploy** | Reconstrói a imagem Docker e sobe o container |

### Pré-requisitos no servidor Jenkins

1. Plugin **NodeJS** instalado e configurado com o nome `NodeJS-20`.
2. Docker instalado e o usuário do Jenkins com permissão para executar comandos Docker (`usermod -aG docker jenkins`).

### Configurar o pipeline

1. Crie um novo item do tipo **Pipeline** no Jenkins.
2. Em **Pipeline > Definition**, selecione **Pipeline script from SCM**.
3. Informe a URL do repositório Git e a branch desejada (ex: `main`).
4. O Jenkins detectará o `Jenkinsfile` automaticamente.

### Executar manualmente

No painel do job, clique em **Build Now**. O progresso de cada estágio aparece no **Stage View**.

### Resultado

Após o deploy bem-sucedido, o frontend estará disponível em `http://<ip-do-servidor>:5173`.

---

## Estrutura do projeto

```
├── public/                  # Arquivos estáticos (favicon, duck-logo.png)
├── src/
│   ├── api/
│   │   └── api.js           # Helper centralizado de chamadas HTTP
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Cadastro.jsx
│   │   ├── Dashboard.jsx    # Painel admin / operador
│   │   ├── LojistaDashboard.jsx
│   │   └── Rastreio.jsx
│   ├── styles/              # CSS por página
│   ├── testes/              # Testes Vitest + Testing Library
│   │   ├── setup.js
│   │   ├── Home.test.jsx
│   │   ├── Login.test.jsx
│   │   ├── Cadastro.test.jsx
│   │   ├── Dashboard.test.jsx
│   │   ├── LojistaDashboard.test.jsx
│   │   ├── RastreioMock.test.jsx
│   │   └── testes_mocks.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.example             # Modelo de variáveis de ambiente
├── .env.docker              # Variáveis para uso com Docker
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── vite.config.js
└── package.json
```

---

## Rotas da aplicação

| Rota | Componente | Acesso |
|---|---|---|
| `/` | `Home` | Público |
| `/login` | `Login` | Público |
| `/cadastro` | `Cadastro` | Público |
| `/rastrear` | `Rastreio` | Público |
| `/dashboard` | `Dashboard` | Admin / Operador |
| `/lojista` | `LojistaDashboard` | Lojista |

A autenticação é verificada via `sessionStorage`. Usuários sem sessão ativa são redirecionados para `/`.
