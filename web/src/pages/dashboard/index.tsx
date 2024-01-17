import { useStore } from 'src/hooks/useStore'
import { auth } from 'src/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from 'src/services/api'
import { useToggle } from 'src/hooks/useToggle'

import { PlusIcon } from '@heroicons/react/24/outline'
import FileModal from 'src/components/modals/FileModal'
import FileCard from 'src/components/files/FileCard'
import DashboardLayout from 'src/layouts/DashboardLayout'
import FileCardSkeleton from 'src/components/files/FileCardSkeleton'
import When from 'src/components/utils/When'

export default function Dashboard() {
  const user = useStore(auth)
  const { data: files, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: api.files.getFiles,
  })

  const [modal, toggleModal] = useToggle(false)

  return (
    <DashboardLayout>
      {modal && (
        <FileModal
          onClose={toggleModal}
          onSuccess={() => refetch().finally(toggleModal)}
        />
      )}
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

      <When
        value={files}
        fallback={
          <ul className="mb-8 grid grid-cols-3 gap-4">
            <li>
              <FileCardSkeleton />
            </li>
            <li>
              <FileCardSkeleton />
            </li>
            <li>
              <FileCardSkeleton />
            </li>
          </ul>
        }
      >
        {(files) =>
          files.length > 0 ? (
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
          )
        }
      </When>
    </DashboardLayout>
  )
}
