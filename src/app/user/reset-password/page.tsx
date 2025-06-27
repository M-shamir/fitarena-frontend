// app/user/reset-password/page.tsx
import { Suspense } from 'react'
import UserResetForm from './UserResetForm'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <UserResetForm />
    </Suspense>
  )
}