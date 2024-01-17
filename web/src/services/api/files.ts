import { getToken } from 'src/services/api/auth'

export type APIFile = {
  id: string
  name: string
  url: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function getFiles() {
  await delay(1_500)

  const response = await fetch('http://localhost:3000/files', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Invalid token')

  const data: APIFile[] = await response.json()

  data.forEach((file) => {
    file.createdAt = new Date(file.createdAt)
    file.updatedAt = new Date(file.updatedAt)
  })

  return data
}

export async function upload(filename: string, file: File) {
  const form = new FormData()
  form.append('file', file)
  form.append('filename', filename)

  const response = await fetch('http://localhost:3000/files', {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Invalid token')

  const data: APIFile = await response.json()

  data.createdAt = new Date(data.createdAt)
  data.updatedAt = new Date(data.updatedAt)

  return data
}

export async function deleteFile(id: string) {
  const response = await fetch(`http://localhost:3000/files/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Invalid token')
}

export async function getCount() {
  const response = await fetch('http://localhost:3000/files/count', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Invalid token')

  const data: { count: number } = await response.json()

  return data.count
}
