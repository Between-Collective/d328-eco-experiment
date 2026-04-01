import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'
import styles from './FloorplanMap.module.css'

interface Props {
  config: AppConfig
}

export default function FloorplanMap({ config }: Props) {
  const { activeCameraIndex, setActiveCameraIndex } = useAppStore()

  return (
    <div className={styles.map} aria-label="Cabin floorplan navigation">
      <div className={styles.imageWrap}>
        <img
          src="/floorplan.png"
          alt="Aircraft cabin floorplan"
          className={styles.image}
          draggable={false}
        />

        {/* Camera position dots */}
        {config.cameras.map((camera, index) => {
          // Normalise x position along cabin length
          const totalLen = 8.5 - (-3.2) // x range from cockpit to galley
          const xPercent = ((camera.position.x - (-3.2)) / totalLen) * 100
          const xClamped = Math.min(95, Math.max(5, xPercent))

          return (
            <button
              key={camera.name}
              className={`${styles.dot} ${activeCameraIndex === index ? styles.activeDot : ''}`}
              style={{ left: `${xClamped}%` }}
              onClick={() => setActiveCameraIndex(index)}
              aria-label={`Navigate to ${camera.name}`}
              aria-pressed={activeCameraIndex === index}
              title={camera.name}
            />
          )
        })}
      </div>

      {/* Go to exterior */}
      <button
        className={styles.exteriorBtn}
        onClick={() => useAppStore.getState().setActiveView('exterior')}
        aria-label="Switch to exterior view"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      </button>
    </div>
  )
}
