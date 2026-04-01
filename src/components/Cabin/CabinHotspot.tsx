import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CameraHotspot } from '@/types/config'
import styles from './CabinHotspot.module.css'

interface Props {
  hotspot: CameraHotspot
  isActive: boolean
  onClick: () => void
}

/**
 * Interior hotspots are displayed as floating markers.
 * We can't easily project 3D sphere coords back to 2D canvas without
 * a camera reference, so we render them as floating descriptors
 * that appear in the HUD when the camera is near the hotspot direction.
 * For a full implementation, the Babylon.js scene would handle 3D placement.
 */
export default function CabinHotspot({ hotspot, isActive, onClick }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive) closeRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) onClick()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isActive, onClick])

  return (
    <>
      {/* Floating indicator */}
      <motion.button
        className={`${styles.marker} ${isActive ? styles.active : ''}`}
        onClick={onClick}
        aria-label={hotspot.description}
        aria-pressed={isActive}
        aria-expanded={isActive}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={styles.plus} aria-hidden="true">
          {isActive ? '×' : '+'}
        </span>
        <span className={styles.ring} aria-hidden="true" />
      </motion.button>

      {/* Description tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={styles.tooltip}
            role="tooltip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <button
              ref={closeRef}
              className={styles.closeBtn}
              onClick={onClick}
              aria-label="Close hotspot"
            >×</button>

            <p className={styles.description}>{hotspot.description}</p>

            {hotspot.video && (
              <div className={styles.videoWrap}>
                <video
                  src={hotspot.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.video}
                  aria-label="Feature video"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
