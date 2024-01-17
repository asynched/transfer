export default function FileCardSkeleton() {
  return (
    <div className="border border-zinc-900 rounded overflow-hidden">
      <div className="h-10 bg-gradient-to-br from-zinc-600 to-zinc-900"></div>
      <div className="p-4 flex flex-col">
        <div className="self-start -mt-8 py-2 px-2 bg-black rounded mb-4 border border-zinc-900">
          <div className="animate-pulse bg-zinc-900 h-6 w-20 rounded"></div>
        </div>
        <div className="flex flex-col">
          <div className="w-48 mb-2 h-6 bg-zinc-800 rounded animate-pulse"></div>
          <div className="w-36 mb-4 h-8 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 border border-zinc-900 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
