let token: string | null = null

export type Profile = {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export async function authenticate(code: string) {
  const response = await fetch(`http://localhost:3000/auth/github?code=${code}`)

  if (!response.ok) throw new Error('Invalid code')

  const data: { token: string } = await response.json()

  return data.token
}

export function getToken() {
  return token
}

export async function setToken(newToken: string | null) {
  token = newToken
}

export async function getProfile() {
  const response = await fetch('http://localhost:3000/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) throw new Error('Invalid token')

  const data: Profile = await response.json()

  data.createdAt = new Date(data.createdAt)
  data.updatedAt = new Date(data.updatedAt)

  return data
}
