import { ElementRef, useRef, useState } from 'react'
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { api } from 'src/services/api'
import { preventDefault } from 'src/utils/ui'

const truncate = (str: string, lenght: number) => {
  if (str.length > lenght) return str.slice(0, lenght) + '...'
  return str
}

export type FileModalProps = {
  onClose: () => unknown
  onSuccess?: () => unknown
}

export default function FileModal({ onClose, onSuccess }: FileModalProps) {
  const fileRef = useRef<ElementRef<'input'>>(null)
  const [filename, setFilename] = useState<string>('')
  const [files, setFiles] = useState<FileList | null>(null)

  const handleUpload = () => {
    if (!files?.length) return

    const file = files[0]

    api.files.upload(filename, file).then(onSuccess)
  }

  return (
    <div className="z-10 fixed top-0 left-0 w-full h-screen bg-zinc-900 bg-opacity-25 backdrop-blur-sm grid place-items-center">
      <div className="p-8 bg-black border border-zinc-900 rounded-lg relative">
        <button onClick={onClose} className="absolute top-8 right-8">
          <XMarkIcon className="w-6 h-6 text-zinc-600" />
        </button>
        <h1 className="text-2xl font-bold tracking-tighter">Upload a file</h1>
        <p className="mb-4">Fill in the form to upload a file</p>
        <form onSubmit={preventDefault(handleUpload)} className="grid gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="w-full bg-transparent py-2 px-4 border border-zinc-900 rounded outline-none transition ease-in-out focus:border-zinc-800"
              type="text"
              placeholder="Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="file">File</label>
            {files?.length ? (
              <button
                type="button"
                onClick={() => fileRef?.current?.click()}
                className="py-2 px-4 border-2 border-dashed border-zinc-900 text-center text-zinc-400 rounded flex gap-2 items-center justify-center"
              >
                <FolderIcon className="w-5 h-5" />
                <span>{truncate(files[0].name, 24)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileRef?.current?.click()}
                className="py-2 px-4 border-2 border-dashed border-zinc-800 rounded text-center text-zinc-500"
              >
                No file selected
              </button>
            )}
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="py-2 px-4 border border-red-600 text-red-500 rounded transition ease-in-out hover:text-white hover:bg-red-600"
            >
              Close
            </button>
            <button className="py-2 px-4 border border-zinc-900 rounded font-medium transition ease-in-out hover:bg-zinc-900 hover:border-zinc-800">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
