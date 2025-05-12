// app/user/bookings/courses/success/page.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import api from '@/utils/api'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      
      api.get(`/payment/verify-payment/?session_id=${sessionId}`)
        .then(() => console.log("Payment verified"))
        .catch(() => console.error("Verification failed"))
    }
  }, [sessionId])

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Session ID: {sessionId}</p>
    </div>
  )
}