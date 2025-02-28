'use client'

import { useEffect, useState, useRef } from 'react'
import { Volume2, Pause, Play, ChevronDown, Square } from 'lucide-react'

export default function ReadAloudButton({ content }: { content: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [speedRate, setSpeedRate] = useState(1.0)
  const [isControlsOpen, setIsControlsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Track current position in text
  const currentPositionRef = useRef(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const cleanedContentRef = useRef('')
  
  // First, set up a flag to confirm we're on the client side
  useEffect(() => {
    setIsClient(true)
    cleanedContentRef.current = cleanText(content)
  }, [content])
  
  // Load all available voices, but filter for English ones only
  useEffect(() => {
    if (!isClient) return

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      
      // Filter for English voices only (lang starts with 'en-')
      // Also filter out Google voices as in the original code
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en-') && 
        !voice.name.toLowerCase().includes('google')
      )
      
      setVoices(englishVoices)
      
      if (englishVoices.length > 0) {
        // Prefer the default voice if available, otherwise first in list
        const defaultVoice = englishVoices.find(voice => voice.default) || englishVoices[0]
        setSelectedVoice(defaultVoice.name)
      }
    }

    loadVoices() // Try loading immediately
    window.speechSynthesis.onvoiceschanged = loadVoices // Update when voices are ready

    // Clean up when component unmounts
    return () => {
      window.speechSynthesis.cancel()
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [isClient])

  // Close controls when clicking outside
  useEffect(() => {
    if (!isClient) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isControlsOpen && !target.closest('.read-aloud-controls')) {
        setIsControlsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isControlsOpen, isClient]);

  const cleanText = (text: string) => {
    return text
      // Remove HTML tags
      .replace(/<\/?(?:h[1-6]|div|img|table|tr|td|th|p|span|a|ul|ol|li|nav|section|header|footer|article|aside|figure|figcaption|main|form|input|button|textarea|select|option|label|iframe|audio|video|canvas|svg|code|pre|blockquote|hr|br)[^>]*>/gi, ' ')
      // Remove markdown symbols
      .replace(/[#*`[\]()]+/g, '')
      // Replace multiple spaces or newlines with a single space
      .replace(/[\s\n]+/g, ' ')
      .trim()
  }

  // Create speech utterance with current settings
  const createUtterance = (text: string) => {
    if (!isClient) return null
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speedRate

    // Apply selected voice
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang // Use the voice's native language
      }
    }

    utterance.onend = () => {
      // Only reset if we've reached the end naturally
      if (currentPositionRef.current >= cleanedContentRef.current.length) {
        setIsSpeaking(false)
        setIsPaused(false)
        currentPositionRef.current = 0
      }
    }

    utterance.onboundary = (event) => {
      // Update position on word boundaries
      if (event.name === 'word') {
        currentPositionRef.current = event.charIndex
      }
    }
    
    return utterance
  }

  const startSpeaking = (fromPosition = 0) => {
    if (!isClient) return
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // Get text from current position to end
    const textToSpeak = cleanedContentRef.current.substring(fromPosition)
    
    if (textToSpeak.length === 0) return
    
    utteranceRef.current = createUtterance(textToSpeak)
    if (utteranceRef.current) {
      window.speechSynthesis.speak(utteranceRef.current)
    }
    
    setIsSpeaking(true)
    setIsPaused(false)
  }

  const handleReadAloud = () => {
    if (!isClient) return
    
    if (isSpeaking && !isPaused) {
      // Pause speech
      window.speechSynthesis.pause()
      setIsPaused(true)
      return
    }
    
    if (isPaused) {
      // Resume speech
      window.speechSynthesis.resume()
      setIsPaused(false)
      return
    }
    
    // Start fresh from the beginning
    currentPositionRef.current = 0
    startSpeaking(0)
  }
  
  const stopReading = () => {
    if (!isClient) return
    
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    currentPositionRef.current = 0
  }

  const changeSpeed = (newRate: number) => {
    setSpeedRate(newRate)
    
    // If currently speaking, restart from current position with new rate
    if (isClient && isSpeaking) {
      startSpeaking(currentPositionRef.current)
    }
  }

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' }
  ]
  
  // Check if speech synthesis is available
  const isSpeechSynthesisAvailable = isClient && 'speechSynthesis' in window
  
  return (
    <div className="relative">
      {/* Main controls - always visible */}
      <div className="flex flex-wrap items-center gap-2 w-full">
        <button
          onClick={handleReadAloud}
          className="flex items-center gap-2 px-4 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={!isSpeechSynthesisAvailable || voices.length === 0}
          title={!isSpeechSynthesisAvailable ? 'Text-to-speech not supported in this browser' : 'Select a voice and click to hear the post'}
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : isSpeaking ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span className="sm:inline hidden">
            {isPaused ? 'Resume' : isSpeaking ? 'Pause' : 'Read Aloud'}
          </span>
        </button>
        
        {isSpeaking && (
          <button
            onClick={stopReading}
            className="flex items-center justify-center gap-2 px-4 py-1 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Square className="w-4 h-4" />
            <span className="sm:inline hidden">Stop</span>
          </button>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center sm:gap-2 gap-1">
            <span className="text-sm sm:inline hidden">Speed:</span>
            <select
              value={speedRate}
              onChange={(e) => changeSpeed(parseFloat(e.target.value))}
              className="px-2 py-1 text-xs sm:text-sm rounded-md bg-background border border-input text-foreground"
            >
              {speedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 read-aloud-controls"
          >
            <span className="sm:inline hidden">Options</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Expanded controls - only visible when toggled */}
      {isControlsOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-background border border-input rounded-md shadow-md z-10 read-aloud-controls w-full sm:w-80">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Voice</label>
              <select
                value={selectedVoice || ''}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full mt-1 px-2 py-1 rounded-md bg-background border border-input text-foreground text-sm"
                disabled={isSpeaking}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Speed</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speedRate}
                  onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm w-10 text-right">{speedRate.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}