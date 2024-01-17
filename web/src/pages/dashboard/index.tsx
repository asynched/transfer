import { useStore } from 'src/hooks/useStore'
import { auth } from 'src/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from 'src/services/api'
import { useToggle } from 'src/hooks/useToggle'

import {
  FolderIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import FileModal from 'src/components/modals/FileModal'
import FileCard from 'src/components/files/FileCard'
import { setToken } from 'src/services/api/auth'

export default function Dashboard() {
  const user = useStore(auth)
  const navigate = useNavigate()
  const { data: files, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: api.files.getFiles,
    initialData: [],
  })

  const [modal, toggleModal] = useToggle(false)

  const handleSignOut = () => {
    localStorage.removeItem('@auth:token')
    auth.set(null)
    setToken(null)
    navigate('/')
  }

  return (
    <div className="flex gap-4 w-full h-screen">
      {modal && (
        <FileModal
          onClose={toggleModal}
          onSuccess={() => refetch().finally(toggleModal)}
        />
      )}
      <nav className="flex flex-col w-64 border-r border-zinc-800 bg-zinc-900 p-8 h-full">
        <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 via-pink-500 to-indigo-500 w-min text-transparent bg-clip-text">
          Transfer
        </h1>
        <p className="mb-4">Share files easily</p>
        <ul className="flex flex-col flex-1 gap-4">
          <li>
            <Link
              className="py-2 px-4 flex gap-2 border border-zinc-800 rounded items-center transition ease-in-out hover:bg-zinc-800 hover:border-zinc-700"
              to="/dashboard/files"
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
        <button
          aria-label="Upload file"
          className="absolute bottom-8 right-8 p-2 bg-zinc-900 border-zinc-800 rounded transition ease-in-out hover:bg-gradient-to-br from-orange-600 via-pink-600 to-indigo-600"
          onClick={toggleModal}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold tracking-tighter">
          Welcome, {user?.name}!
        </h1>
        <p className="mb-8">What's up for today?</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tighter">Your files</h2>
        {files.length > 0 ? (
          <ul className="grid grid-cols-3 gap-4">
            {files.map((file) => (
              <li key={file.id}>
                <FileCard file={file} onDelete={refetch} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 px-8 border-2 border-dashed border-zinc-900 rounded text-center">
            <p className="mb-2">No files found</p>
            <button
              onClick={toggleModal}
              className="text-sm py-1 border border-zinc-800 px-4 rounded bg-zinc-900 transition ease-in-out hover:bg-zinc-800 hover:border-zinc-700"
            >
              Add a new file
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
