import { GITHUB_OAUTH_URL } from 'src/config/env'

export default function Home() {
  return (
    <div className="flex gap-4 w-full h-screen">
      <nav className="p-8 w-72 flex flex-col justify-center items-center border-r border-zinc-800 bg-zinc-900">
        <h1 className="text-4xl font-bold tracking-tighter">Sign-up</h1>
        <p className="mb-8">Choose your provider</p>
        <button className="mb-4 py-2 w-full rounded bg-red-500 text-white">
          Google
        </button>
        <a
          href={GITHUB_OAUTH_URL}
          className="py-2 w-full rounded bg-zinc-800 text-white text-center"
        >
          GitHub
        </a>
      </nav>
      <main className="grid place-items-center flex-1">
        <h1 className="text-5xl font-bold tracking-tighter">
          Share files online
        </h1>
      </main>
    </div>
  )
}
