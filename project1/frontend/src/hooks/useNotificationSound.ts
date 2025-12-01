import { useCallback, useRef } from 'react'

type SoundType = 'success' | 'info' | 'warning' | 'achievement'

interface UseNotificationSoundOptions {
  enabled?: boolean
  volume?: number
}

export function useNotificationSound(options: UseNotificationSoundOptions = {}) {
  const { enabled = true, volume = 0.5 } = options
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback((type: SoundType = 'info') => {
    if (!enabled) return

    try {
      // Create audio element if not exists
      if (!audioRef.current) {
        audioRef.current = new Audio()
        audioRef.current.volume = volume
      }

      // Set sound based on type
      const soundMap: Record<SoundType, string> = {
        success: '/sounds/success.mp3',
        info: '/sounds/notification.mp3',
        warning: '/sounds/warning.mp3',
        achievement: '/sounds/achievement.mp3'
      }

      audioRef.current.src = soundMap[type] || soundMap.info
      
      // Play sound
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play notification sound:', error)
      })
    } catch (error) {
      console.warn('Error playing notification sound:', error)
    }
  }, [enabled, volume])

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))
    }
  }, [])

  return {
    playSound,
    stopSound,
    setVolume
  }
}
