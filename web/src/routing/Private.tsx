import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'src/hooks/useStore'
import { api } from 'src/services/api'
import { auth } from 'src/stores/auth'

type PrivateProps = {
  children: ReactNode
  onLoading?: ReactNode
}

export default function Private({ children, onLoading }: PrivateProps) {
  const navigate = useNavigate()
  const user = useStore(auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('@auth:token')

    if (!token) {
      return navigate('/')
    }

    api.auth
      .setToken(token)
      .then(() => api.auth.getProfile())
      .then((profile) => auth.set(profile))
      .catch((err) => {
        console.error(err)
        localStorage.removeItem('@auth:token')
        navigate('/')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <>{onLoading}</>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
