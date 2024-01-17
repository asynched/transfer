import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from 'src/services/api'
import { auth } from 'src/stores/auth'
import Spinner from 'src/components/spinners/Spinner'

export default function GithubAuthCallback() {
  const navigate = useNavigate()
  const [state, setState] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    const url = new URL(window.location.href)

    const code = url.searchParams.get('code')

    if (!code) {
      setState('error')
      return
    }

    api.auth
      .authenticate(code)
      .then((token) => {
        api.auth.setToken(token)
        localStorage.setItem('@auth:token', token)
      })
      .then(() => api.auth.getProfile())
      .then((profile) => auth.set(profile))
      .then(() => setState('success'))
      .catch((err) => {
        console.error(err)
        setState('error')
      })
  }, [])

  useEffect(() => {
    if (state !== 'success') return

    const timeout = setTimeout(() => {
      navigate('/dashboard')
    }, 3_000)

    return () => clearTimeout(timeout)
  }, [state])

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Authenticating</h1>
        <p className="mb-4">
          {state === 'pending'
            ? 'Authenticating with GitHub...'
            : state === 'success'
            ? 'Success! Redirecting...'
            : 'Error authenticating with GitHub'}
        </p>
        {state !== 'error' && <Spinner />}
        {state === 'error' && (
          <Link
            className="py-2 px-4 bg-zinc-900 border border-zinc-800 rounded"
            to="/"
          >
            Go back
          </Link>
        )}
      </div>
    </div>
  )
}
