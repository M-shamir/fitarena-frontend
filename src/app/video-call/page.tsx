// src/app/video-call/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

export default function VideoCallPage() {
  const searchParams = useSearchParams()
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const room_id = searchParams.get('room_id')
    const token = searchParams.get('token')
    const role = searchParams.get('role')
    const user_id = searchParams.get('user_id')
    const user_name = searchParams.get('user_name')
    
    if (!room_id || !token || !role || !user_id) {
      alert('Missing required parameters')
      window.close()
      return
    }

    const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || '0')
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || ''
    
    if (!appID || !serverSecret) {
      alert('Zego configuration missing')
      window.close()
      return
    }

    const initVideoCall = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        room_id,
        user_id,
        user_name || `User_${user_id}`
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      
      zp.joinRoom({
        container: videoContainerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
          config: {
            role: role === 'host' ? 
              ZegoUIKitPrebuilt.Host : 
              ZegoUIKitPrebuilt.Audience,
          },
        },
        showPreJoinView: false,
        onLeaveRoom: () => {
          window.close()
        },
      })
    }

    initVideoCall()
  }, [searchParams])

  return (
    <div className="w-full h-screen">
      <div ref={videoContainerRef} className="w-full h-full" />
    </div>
  )
}