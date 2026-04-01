import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import type { ActiveView } from '@/stores/appStore'
import styles from './InteractionGuide.module.css'

interface Props {
  activeView: ActiveView
}

const EXTERIOR_TIPS = [
  { icon: '↔', label: 'Drag to rotate', detail: 'Click and drag to spin the aircraft' },
  { icon: '⊕', label: 'Scroll to zoom', detail: 'Mouse wheel or pinch to zoom in/out' },
  { icon: '⊙', label: 'Click hotspots', detail: 'Tap the glowing icons to explore features' },
]

const CABIN_TIPS = [
  { icon: '↔', label: 'Drag to look around', detail: 'Click and drag to pan the 360° view' },
  { icon: '⊙', label: 'Click hotspots', detail: 'Tap the + icons to learn about the cabin' },
  { icon: '◉', label: 'Navigate positions', detail: 'Use the bottom bar to change your viewpoint' },
]

export default function InteractionGuide({ activeView }: Props) {
  const { guideVisible, dismissGuide } = useAppStore()
  const dismissRef = useRef<HTMLButtonElement>(null)

  const tips = activeView === 'exterior' ? EXTERIOR_TIPS : CABIN_TIPS
  const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

  useEffect(() => {
    if (guideVisible) {
      dismissRef.current?.focus()
    }
  }, [guideVisible])

  useEffect(() => {
    if (!guideVisible) return
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(dismissGuide, 8000)
    return () => clearTimeout(timer)
  }, [guideVisible, dismissGuide])

  return (
    <AnimatePresence>
      {guideVisible && (
        <motion.div
          className={styles.guide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-label="How to navigate this experience"
          aria-modal="false"
        >
          <div className={styles.tips}>
            {tips.map((tip) => (
              <div key={tip.label} className={styles.tip}>
                <span className={styles.icon} aria-hidden="true">
                  {/* Show touch or mouse icon based on device */}
                  {isTouchDevice && tip.label.includes('Drag')
                    ? '👆'
                    : isTouchDevice && tip.label.includes('Scroll')
                    ? '🤌'
                    : tip.icon}
                </span>
                <div>
                  <p className={styles.tipLabel}>{
                    isTouchDevice
                      ? tip.label.replace('Drag', 'Swipe').replace('Scroll', 'Pinch')
                      : tip.label
                  }</p>
                  <p className={styles.tipDetail}>{
                    isTouchDevice
                      ? tip.detail.replace('Click and drag', 'Swipe').replace('Mouse wheel or pinch', 'Pinch')
                      : tip.detail
                  }</p>
                </div>
              </div>
            ))}
          </div>

          <button
            ref={dismissRef}
            className={styles.dismissBtn}
            onClick={dismissGuide}
            aria-label="Dismiss navigation guide"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
