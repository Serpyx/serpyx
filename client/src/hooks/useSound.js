import { useRef, useEffect, useState } from 'react'

export const useSound = () => {
  const audioContextRef = useRef(null)

  useEffect(() => {
    // Audio context oluştur
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.log('Audio context not supported:', e)
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Ses üretme fonksiyonu
  const createTone = (frequency, duration, type = 'sine') => {
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (e) {
      console.log('Sound creation error:', e)
    }
  }

  const playCoinSound = () => {
    console.log('🔊 Playing coin sound')
    createTone(800, 0.1, 'sine') // Yüksek ton
    setTimeout(() => createTone(1000, 0.1, 'sine'), 50) // Daha yüksek ton
  }

  const playBonusSound = () => {
    console.log('🔊 Playing bonus sound')
    createTone(600, 0.1, 'square') // Kare dalga
    setTimeout(() => createTone(800, 0.1, 'square'), 50)
    setTimeout(() => createTone(1000, 0.1, 'square'), 100)
  }

  const playGameOverSound = () => {
    console.log('🔊 Playing game over sound')
    createTone(200, 0.3, 'sawtooth') // Düşük ton, uzun süre
    setTimeout(() => createTone(150, 0.3, 'sawtooth'), 100)
    setTimeout(() => createTone(100, 0.3, 'sawtooth'), 200)
  }

  const playButtonClick = () => {
    console.log('🔊 Playing button click sound')
    createTone(400, 0.05, 'sine')
  }

  const playHoverSound = () => {
    console.log('🔊 Playing hover sound')
    createTone(600, 0.03, 'sine')
  }

  const playSuccessSound = () => {
    console.log('🔊 Playing success sound')
    createTone(800, 0.1, 'sine')
    setTimeout(() => createTone(1000, 0.1, 'sine'), 50)
    setTimeout(() => createTone(1200, 0.1, 'sine'), 100)
  }

  const playErrorSound = () => {
    console.log('🔊 Playing error sound')
    createTone(300, 0.2, 'sawtooth')
    setTimeout(() => createTone(250, 0.2, 'sawtooth'), 100)
  }

  const playPageTransition = () => {
    console.log('🔊 Playing page transition sound')
    createTone(500, 0.1, 'sine')
    setTimeout(() => createTone(700, 0.1, 'sine'), 50)
  }

  // Background music functionality
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const musicIntervalRef = useRef(null)

  const startBackgroundMusic = () => {
    if (isMusicPlaying) return // Prevent multiple instances
    
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create continuous ambient background music
      const createContinuousMelody = () => {
        const now = audioContextRef.current.currentTime
        const noteDuration = 2.0 // Longer notes for ambient feel
        
        // Simple, clean melody that loops seamlessly
        const melody = [
          { freq: 330, time: 0 },    // E4
          { freq: 440, time: 2 },    // A4
          { freq: 494, time: 4 },    // B4
          { freq: 587, time: 6 },    // D5
          { freq: 659, time: 8 },    // E5
          { freq: 587, time: 10 },   // D5
          { freq: 494, time: 12 },   // B4
          { freq: 440, time: 14 }    // A4
        ]
        
        // Create oscillators for each note
        melody.forEach(note => {
          const oscillator = audioContextRef.current.createOscillator()
          const gainNode = audioContextRef.current.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContextRef.current.destination)
          
          oscillator.type = 'sine' // Softer sound
          oscillator.frequency.setValueAtTime(note.freq, now + note.time)
          
          // Smooth volume envelope
          gainNode.gain.setValueAtTime(0, now + note.time)
          gainNode.gain.linearRampToValueAtTime(0.015, now + note.time + 0.1) // Very low volume
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + noteDuration - 0.1)
          gainNode.gain.setValueAtTime(0, now + note.time + noteDuration)
          
          oscillator.start(now + note.time)
          oscillator.stop(now + note.time + noteDuration)
        })
      }
      
      // Play initial melody
      createContinuousMelody()
      
      // Loop every 16 seconds (seamless loop)
      musicIntervalRef.current = setInterval(createContinuousMelody, 16000)
      
      setIsMusicPlaying(true)
      console.log('🎵 Ambient background music started')
    } catch (error) {
      console.log('Audio context error:', error)
    }
  }

  const stopBackgroundMusic = () => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current)
      musicIntervalRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsMusicPlaying(false)
    console.log('🎵 Background music stopped')
  }

  const toggleBackgroundMusic = () => {
    console.log('Toggle music - Current state:', isMusicPlaying)
    if (isMusicPlaying) {
      stopBackgroundMusic()
    } else {
      startBackgroundMusic()
    }
  }

  return {
    playCoinSound,
    playBonusSound,
    playGameOverSound,
    playButtonClick,
    playHoverSound,
    playSuccessSound,
    playErrorSound,
    playPageTransition,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    isMusicPlaying
  }
} 