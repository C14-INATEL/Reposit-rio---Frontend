Frontend Repositório - Instalação e Execução

Este repositório contém o front-end em React + Vite para o projeto.

Requisitos
- Node.js >= 20
- npm >= 9
- Git
- (Opcional) Docker + Docker Compose

1) Clonar o repositorio


git clone https://github.com/C14-INATEL/Reposit-rio---Frontend.git
cd Reposit-rio---Frontend


2) Instalar dependencias


npm install


3) Rodar em desenvolvimento


npm run dev


A aplicação ficará disponível em `http://localhost:5173`.

4) Build de produto


npm run build


6) Variaveis de ambiente

Se usar arquivo `.env` (a aplicação pode precisar de `VITE_API_URL`):


VITE_API_URL=http://localhost:3000


7) Rodar com Docker Compose (opcional)

No diretório raiz do `DUCK` (onde estão `docker-compose.yml`):

docker compose up -d --build

Acesse:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
