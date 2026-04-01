import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'

function buildFrameUrl(config: AppConfig, frame: number): string {
  const { basePath, fileNamePattern, framePadding } = config.turntable
  const padded = String(frame).padStart(framePadding, '0')
  const filename = fileNamePattern.replace('{frame}', padded)
  return `${basePath}/${filename}`
}

function buildLoadOrder(initialFrame: number, totalFrames: number): number[] {
  // Priority: initial frame, then expand outward in both directions
  const order: number[] = [initialFrame]
  for (let i = 1; i < totalFrames; i++) {
    const next = (initialFrame + i) % totalFrames
    const prev = ((initialFrame - i) % totalFrames + totalFrames) % totalFrames
    if (!order.includes(next)) order.push(next)
    if (!order.includes(prev)) order.push(prev)
  }
  return order
}

export function useImagePreloader(config: AppConfig | null) {
  const { setLoadProgress, setIsLoaded, currentFrame } = useAppStore()
  const loaded = useRef(0)
  const total = useRef(0)
  const started = useRef(false)

  useEffect(() => {
    if (!config || started.current) return
    started.current = true

    const { frameCount, initialFrame } = config.turntable
    total.current = frameCount
    loaded.current = 0

    const order = buildLoadOrder(initialFrame, frameCount)

    // Load frames progressively
    const loadFrame = (index: number) => {
      const url = buildFrameUrl(config, order[index])
      const img = new Image()
      img.onload = img.onerror = () => {
        loaded.current++
        // Progress: 5% reserved for config, 5% for first-frame, 90% for all frames
        const progress = 5 + Math.round((loaded.current / total.current) * 90)
        setLoadProgress(progress)
        if (loaded.current === total.current) {
          setLoadProgress(100)
          setTimeout(() => setIsLoaded(true), 300)
        }
      }
      img.src = url
    }

    // Load first 3 frames immediately for fast first-paint
    const urgentCount = Math.min(3, order.length)
    for (let i = 0; i < urgentCount; i++) {
      loadFrame(i)
    }

    // Queue the rest with requestIdleCallback / setTimeout
    let i = urgentCount
    const loadNext = () => {
      if (i >= order.length) return
      loadFrame(i++)
      if (i < order.length) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadNext, { timeout: 200 })
        } else {
          setTimeout(loadNext, 16)
        }
      }
    }
    if (i < order.length) {
      setTimeout(loadNext, 100)
    }
  }, [config, setLoadProgress, setIsLoaded, currentFrame])
}
