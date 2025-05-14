// ~/app/components/auth/ProtectedRoute.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'trainer' | 'stadium_owner' | 'admin'
  redirectTo?: string
  preventRoles?: ('trainer' | 'stadium_owner' | 'admin')[]
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/',
  preventRoles,
}: ProtectedRouteProps) => {
  const router = useRouter()
  const { user, isAuthenticated, role, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Check if current role is in preventRoles list
      if (preventRoles && role && preventRoles.includes(role)) {
        router.push('/unauthorized') // Or specific dashboard based on role
        return
      }

      // Check if role is required and doesn't match
      if (requiredRole && role !== requiredRole) {
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, role, loading, router, requiredRole, redirectTo, preventRoles])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null // or redirect to login
  }

  // Check preventRoles after authentication
  if (preventRoles && role && preventRoles.includes(role)) {
    return null // or redirect to appropriate dashboard
  }

  // Check required role if specified
  if (requiredRole && role !== requiredRole) {
    return null
  }

  return <>{children}</>
}