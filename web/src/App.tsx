import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthLoadingSpinner from 'src/components/spinners/AuthLoadingSpinner'
import Private from 'src/routing/Private'
import Public from 'src/routing/Public'

import Home from 'src/pages/Home'
import GithubAuthCallback from 'src/pages/auth/github/callback'
import Dashboard from 'src/pages/dashboard'
import Profile from 'src/pages/dashboard/profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Public>
        <Home />
      </Public>
    ),
  },
  {
    path: '/auth/github/callback',
    element: <GithubAuthCallback />,
  },
  {
    path: '/dashboard',
    element: (
      <Private onLoading={<AuthLoadingSpinner />}>
        <Dashboard />
      </Private>
    ),
  },
  {
    path: '/dashboard/profile',
    element: (
      <Private onLoading={<AuthLoadingSpinner />}>
        <Profile />
      </Private>
    ),
  },
])

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
