import { useQuery } from '@tanstack/react-query'
import { useStore } from 'src/hooks/useStore'
import DashboardLayout from 'src/layouts/DashboardLayout'
import { api } from 'src/services/api'
import { auth } from 'src/stores/auth'

export default function Profile() {
  const user = useStore(auth)

  const { data: count } = useQuery({
    queryKey: ['count'],
    queryFn: api.files.getCount,
    initialData: 0,
  })

  return (
    <DashboardLayout>
      <h1 className="mb-4 text-4xl font-bold tracking-tighter">Profile</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Name</h2>
          <p>{user?.name}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Email</h2>
          <p>{user?.email}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Created</h2>
          <p>{user?.createdAt.toLocaleDateString()}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Count</h2>
          <p>{count} files</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
