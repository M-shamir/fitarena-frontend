// ~/app/components/auth/PublicRoute.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '@/store/authStore'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const router = useRouter()
  const { isAuthenticated, role, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && isAuthenticated && role) {
      // Redirect to appropriate dashboard based on role
      switch(role) {
        case 'admin':
          router.push('/admin/dashboard')
          break
        case 'trainer':
          router.push('/trainer/dashboard')
          break
        case 'stadium_owner':
          router.push('/stadium_owner/dashboard')
          break
        case 'user':
        default:
          router.push('/user/home')
      }
    }
  }, [isAuthenticated, role, loading, router])

  if (loading || (isAuthenticated && role)) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}