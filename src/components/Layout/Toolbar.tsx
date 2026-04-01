import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'
import IconButton from '@/components/common/IconButton'
import styles from './Toolbar.module.css'

interface Props {
  config: AppConfig
}

/* SVG icons as inline components for crisp rendering */
const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
)

const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
)

const ZoomOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
)

const RotateLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
)

const RotateRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
  </svg>
)

const FloorplanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
)

const NightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function Toolbar({ config }: Props) {
  const {
    activeView,
    zoomLevel,
    setZoomLevel,
    setCurrentFrame,
    currentFrame,
    isNightMode,
    toggleNightMode,
  } = useAppStore()

  const isExterior = activeView === 'exterior'
  const { min, max } = config.turntable.zoom
  const ZOOM_STEP = 0.1
  const ROTATE_STEP = 5

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleZoomIn = () => setZoomLevel(Math.min(max, zoomLevel + ZOOM_STEP))
  const handleZoomOut = () => setZoomLevel(Math.max(min, zoomLevel - ZOOM_STEP))

  const handleRotateLeft = () =>
    setCurrentFrame(currentFrame - ROTATE_STEP)
  const handleRotateRight = () =>
    setCurrentFrame(currentFrame + ROTATE_STEP)

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="View controls">
      <IconButton onClick={handleFullscreen} aria-label="Toggle fullscreen">
        <FullscreenIcon />
      </IconButton>

      <IconButton onClick={handleZoomIn} aria-label="Zoom in" disabled={zoomLevel >= max}>
        <ZoomInIcon />
      </IconButton>

      {isExterior && (
        <div className={styles.rotateGroup}>
          <IconButton onClick={handleRotateLeft} aria-label="Rotate aircraft left">
            <RotateLeftIcon />
          </IconButton>
          <IconButton active aria-label="Rotate aircraft" className={styles.rotateCenter}>
            <FloorplanIcon />
          </IconButton>
          <IconButton onClick={handleRotateRight} aria-label="Rotate aircraft right">
            <RotateRightIcon />
          </IconButton>
        </div>
      )}

      <IconButton onClick={handleZoomOut} aria-label="Zoom out" disabled={zoomLevel <= min}>
        <ZoomOutIcon />
      </IconButton>

      <IconButton
        onClick={toggleNightMode}
        aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
        aria-pressed={isNightMode}
        active={isNightMode}
      >
        <NightIcon />
      </IconButton>
    </div>
  )
}
