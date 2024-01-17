import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'src/hooks/useStore'
import { auth } from 'src/stores/auth'

type PublicProps = {
  children: ReactNode
  redirectTo?: string
}

export default function Public({
  children,
  redirectTo = '/dashboard',
}: PublicProps) {
  const user = useStore(auth)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('@auth:token')

    if (!token) {
      return
    }

    navigate(redirectTo)
  }, [])

  if (user) {
    return null
  }

  return <>{children}</>
}
