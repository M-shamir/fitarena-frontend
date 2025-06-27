// app/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}