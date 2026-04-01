import { useRef, useCallback, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'

export function useTurntable(config: AppConfig, containerRef: React.RefObject<HTMLDivElement | null>) {
  const { currentFrame, setCurrentFrame, zoomLevel, setZoomLevel } = useAppStore()
  const dragRef = useRef<{ startX: number; startFrame: number } | null>(null)
  const isTouching = useRef(false)

  const DRAG_SENSITIVITY = 0.4 // frames per pixel
  const { frameCount, zoom } = config.turntable

  const handleMouseDown = useCallback((e: MouseEvent) => {
    dragRef.current = { startX: e.clientX, startFrame: currentFrame }
    document.body.style.cursor = 'grabbing'
  }, [currentFrame])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return
    const delta = (dragRef.current.startX - e.clientX) * DRAG_SENSITIVITY
    const newFrame = Math.round(dragRef.current.startFrame + delta)
    setCurrentFrame(((newFrame % frameCount) + frameCount) % frameCount)
  }, [setCurrentFrame, frameCount])

  const handleMouseUp = useCallback(() => {
    dragRef.current = null
    document.body.style.cursor = ''
  }, [])

  // Touch support
  const touchStartRef = useRef<{ x: number; frame: number } | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      isTouching.current = true
      touchStartRef.current = { x: e.touches[0].clientX, frame: currentFrame }
    }
  }, [currentFrame])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return
    e.preventDefault()
    const delta = (touchStartRef.current.x - e.touches[0].clientX) * DRAG_SENSITIVITY
    const newFrame = Math.round(touchStartRef.current.frame + delta)
    setCurrentFrame(((newFrame % frameCount) + frameCount) % frameCount)
  }, [setCurrentFrame, frameCount])

  const handleTouchEnd = useCallback(() => {
    isTouching.current = false
    touchStartRef.current = null
  }, [])

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    setZoomLevel(Math.min(zoom.max, Math.max(zoom.min, zoomLevel + delta)))
  }, [zoomLevel, setZoomLevel, zoom])

  // Keyboard control
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setCurrentFrame(currentFrame - 1)
    else if (e.key === 'ArrowRight') setCurrentFrame(currentFrame + 1)
    else if (e.key === '+' || e.key === '=') setZoomLevel(Math.min(zoom.max, zoomLevel + 0.1))
    else if (e.key === '-') setZoomLevel(Math.max(zoom.min, zoomLevel - 0.1))
  }, [currentFrame, zoomLevel, setCurrentFrame, setZoomLevel, zoom])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)
    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('keydown', handleKeyDown)

    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, handleKeyDown, containerRef])
}
