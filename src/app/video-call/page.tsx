// src/app/video-call/page.tsx
'use client'


import dynamic from 'next/dynamic'

// Disable SSR for the video call component
const VideoCallComponent = dynamic(
  () => import('./VideoCallComponent'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-screen flex items-center justify-center">Loading video call...</div>
  }
)

export default function VideoCallPage() {
  return <VideoCallComponent />
}