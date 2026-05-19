const fallbackApiUrl = 'http://localhost:8000'

export const apiBaseUrl = import.meta.env.VITE_API_URL || fallbackApiUrl
const authTokenKey = 'stegano_access_token'

async function parseJsonSafe(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(authTokenKey)
}

export function setStoredToken(token: string | null): void {
  if (!token) {
    localStorage.removeItem(authTokenKey)
    return
  }
  localStorage.setItem(authTokenKey, token)
}

function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchJson<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  })
  if (!response.ok) {
    const maybeJson = await parseJsonSafe(response)
    const message =
      maybeJson && typeof maybeJson.detail === 'string'
        ? maybeJson.detail
        : `Erreur API (${response.status})`
    throw new Error(message)
  }
  return (await response.json()) as T
}

export async function postImageForm<T>(
  endpoint: string,
  file: File,
  extraFields?: Record<string, string>,
): Promise<T> {
  const form = new FormData()
  form.append('image', file)
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => form.append(key, value))
  }
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    body: form,
    headers: {
      ...authHeaders(),
    },
  })
  if (!response.ok) {
    const maybeJson = await parseJsonSafe(response)
    const message =
      maybeJson && typeof maybeJson.detail === 'string'
        ? maybeJson.detail
        : `Erreur API (${response.status})`
    throw new Error(message)
  }
  return (await response.json()) as T
}

export async function postImageAndDownload(
  endpoint: string,
  file: File,
  extraFields?: Record<string, string>,
): Promise<{ blob: Blob; headers: Headers }> {
  const form = new FormData()
  form.append('image', file)
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => form.append(key, value))
  }
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    body: form,
    headers: {
      ...authHeaders(),
    },
  })
  if (!response.ok) {
    const maybeJson = await parseJsonSafe(response)
    const message =
      maybeJson && typeof maybeJson.detail === 'string'
        ? maybeJson.detail
        : `Erreur API (${response.status})`
    throw new Error(message)
  }
  return { blob: await response.blob(), headers: response.headers }
}

export async function fetchBlob(endpoint: string): Promise<Blob | null> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: {
      ...authHeaders(),
    },
  })
  if (!response.ok) {
    return null
  }
  return response.blob()
}
