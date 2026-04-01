import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TurntableHotspot } from '@/types/config'
import styles from './HotspotDetail.module.css'

interface Props {
  hotspot: TurntableHotspot
  onClose: () => void
}

export default function HotspotDetail({ hotspot, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus close button on open, handle Escape
  useEffect(() => {
    closeRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.aside
        className={styles.panel}
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-label={hotspot.headline}
      >
        {/* Close */}
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close panel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.scrollable}>
          {/* Video */}
          {hotspot.video && (
            <div className={styles.videoWrap}>
              <video
                src={hotspot.video}
                autoPlay
                loop
                muted
                playsInline
                className={styles.video}
                aria-label={`${hotspot.headline} video`}
              />
            </div>
          )}

          {/* Icon + headline */}
          <div className={styles.header}>
            <img src={hotspot.icon} alt="" className={styles.icon} aria-hidden="true" />
            <h2 className={styles.headline}>{hotspot.headline}</h2>
          </div>

          {/* Subheadline */}
          {hotspot.subheadline && (
            <p className={styles.subheadline}>{hotspot.subheadline}</p>
          )}

          {/* Bullet list */}
          {hotspot.list.length > 0 && (
            <ul className={styles.list} aria-label="Key features">
              {hotspot.list.map((item) => (
                <li key={item} className={styles.listItem}>
                  <span className={styles.bullet} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Disclaimer */}
          {hotspot.disclaim && (
            <p className={styles.disclaim}>{hotspot.disclaim}</p>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
