// Helper compartilhado de chamadas à API do backend.
// Centraliza a URL base (vinda de VITE_API_URL com fallback localhost) e
// o tratamento de erro padrão para todas as telas.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, { method = 'GET', body, headers } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(`${API_URL}${path}`, opts)

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const mensagem = (data && data.mensagem) || `Erro ${res.status}`
    const err = new Error(mensagem)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const api = {
  get:    (path)        => request(path),
  post:   (path, body)  => request(path, { method: 'POST', body }),
  put:    (path, body)  => request(path, { method: 'PUT', body }),
  patch:  (path, body)  => request(path, { method: 'PATCH', body }),
  delete: (path)        => request(path, { method: 'DELETE' }),
}

export const apiUrl = API_URL
