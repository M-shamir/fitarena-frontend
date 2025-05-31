// utils/zego.ts
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

export const initializeZegoSDK = async (
  roomID: string,
  token: string,
  role: 'host' | 'user',
  userName: string,
  onLeave?: () => void
) => {
  const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID!
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    Date.now().toString(),
    userName
  )

  const zp = ZegoUIKitPrebuilt.create(kitToken)
  
  const config = role === 'host' 
    ? {
        showPreJoinView: false,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showLeavingView: false,
        onLeave: () => {
          onLeave?.()
          window.location.href = '/trainer/live-sessions'
        },
      }
    : {
        showPreJoinView: true,
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showLeavingView: true,
        onLeave: () => {
          onLeave?.()
          window.location.href = '/my-sessions'
        },
      }

  zp.joinRoom({
    container: document.querySelector('#zego-video-container')!,
    scenario: {
      mode: ZegoUIKitPrebuilt.VideoConference,
    },
    ...config,
  })

  return zp
}