import { motion } from 'framer-motion'
import type { TurntableHotspot } from '@/types/config'
import styles from './ExteriorHotspot.module.css'

interface Props {
  hotspot: TurntableHotspot
  frame: number
  totalFrames: number
  verticalOffset: number
  isActive: boolean
  onClick: () => void
}

/**
 * Map a hotspot's elliptical position to CSS coords.
 * The config defines an eclipse (height, width, offset) and
 * visibleOnFrames range. We interpolate position along that arc.
 */
function getHotspotPosition(hotspot: TurntableHotspot, frame: number, totalFrames: number) {
  const { eclipse } = hotspot
  const { from, to } = hotspot.visibleOnFrames

  // Normalise frame to a 0–1 value within the visible range
  let range: number
  let progress: number

  if (from <= to) {
    range = to - from
    progress = range > 0 ? (frame - from) / range : 0
  } else {
    // Wraps around
    range = totalFrames - from + to
    let rel = frame >= from ? frame - from : totalFrames - from + frame
    progress = range > 0 ? rel / range : 0
  }

  // Place hotspot at the configured path position
  const pathRatio = eclipse.offset.path / 100

  // X: follows the ellipse arc using the path ratio
  const angle = Math.PI * (progress - 0.5) // -90 to +90 degrees range
  const x = 50 + Math.sin(angle * pathRatio * Math.PI) * (eclipse.width / 2)

  // Y: base position from offset
  const y = 50 + eclipse.offset.y

  return { x, y }
}

export default function ExteriorHotspot({ hotspot, frame, totalFrames, isActive, onClick }: Props) {
  const pos = getHotspotPosition(hotspot, frame, totalFrames)

  return (
    <motion.button
      className={`${styles.hotspot} ${isActive ? styles.active : ''}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label={`${hotspot.headline} — click to learn more`}
      aria-pressed={isActive}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className={styles.ring} aria-hidden="true" />
      <img
        src={hotspot.hotspotIcon}
        alt=""
        className={styles.icon}
      />
    </motion.button>
  )
}
