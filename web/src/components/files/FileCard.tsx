import { ClipboardIcon, LinkIcon } from '@heroicons/react/24/outline'
import { api } from 'src/services/api'
import { APIFile } from 'src/services/api/files'
import { addDays } from 'src/utils/dates'

type FileCardProps = {
  file: APIFile
  onDelete?: () => unknown
}

export default function FileCard({ file, onDelete }: FileCardProps) {
  return (
    <div className="border border-zinc-900 rounded overflow-hidden">
      <div className="h-10 bg-gradient-to-br from-orange-600 via-pink-600 to-indigo-600"></div>
      <div className="p-4 flex flex-col">
        <div className="self-start -mt-8 py-1 px-2 bg-black rounded mb-4 border border-zinc-900">
          <h2 className="text-xl font-bold tracking-tighter">{file.name}</h2>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <a
            className=" flex gap-1 items-center hover:underline"
            href={`http://localhost:3000/${file.url}`}
            target="_blank"
          >
            <LinkIcon className="w-4 h-4" />
            <span>Preview</span>
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`http://localhost:3000/${file.url}`)
            }}
            className="flex gap-1 items-center"
          >
            <ClipboardIcon className="w-4 h-4" />
            <span>Copy link</span>
          </button>
        </div>
        <p className="text-zinc-500 text-sm">
          Created at: {file.createdAt.toLocaleDateString()}
        </p>
        <p className="mb-4 text-zinc-500 text-sm">
          Expires: {addDays(file.createdAt, 1).toLocaleDateString()}
        </p>
        <button
          onClick={() => api.files.deleteFile(file.id).then(onDelete)}
          className="text-sm py-1 border border-zinc-900 rounded transition ease-in-out hover:border-red-600 hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
