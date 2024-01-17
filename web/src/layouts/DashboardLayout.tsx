import {
  ArrowLeftEndOnRectangleIcon,
  FolderIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setToken } from 'src/services/api/auth'
import { auth } from 'src/stores/auth'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('@auth:token')
    auth.set(null)
    setToken(null)
    navigate('/')
  }

  return (
    <div className="flex gap-4 w-full h-screen">
      <nav className="flex flex-col w-64 border-r border-zinc-800 bg-zinc-900 p-8 h-full">
        <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 via-pink-500 to-indigo-500 w-min text-transparent bg-clip-text">
          Transfer
        </h1>
        <p className="mb-4">Share files easily</p>
        <ul className="flex flex-col flex-1 gap-4">
          <li>
            <Link
              className="py-2 px-4 flex gap-2 border border-zinc-800 rounded items-center transition ease-in-out hover:bg-zinc-800 hover:border-zinc-700"
              to="/dashboard"
            >
              <FolderIcon className="w-5 h-5" />
              <span>Files</span>
            </Link>
          </li>
          <li>
            <Link
              className="py-2 px-4 flex gap-2 border border-zinc-800 rounded items-center transition ease-in-out hover:bg-zinc-800 hover:border-zinc-700"
              to="/dashboard/profile"
            >
              <UserIcon className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li className="mt-auto">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 justify-center bg-red-600 w-full py-2 px-4 rounded transition ease-in-out hover:shadow-md hover:shadow-red-500/25"
            >
              <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </li>
        </ul>
      </nav>
      <main className="max-w-screen-lg w-full mx-auto py-8 relative">
        {children}
      </main>
    </div>
  )
}
