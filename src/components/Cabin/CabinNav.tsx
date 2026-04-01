import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'
import styles from './CabinNav.module.css'

interface Props {
  config: AppConfig
}

export default function CabinNav({ config }: Props) {
  const { activeCameraIndex, setActiveCameraIndex } = useAppStore()

  return (
    <nav className={styles.nav} aria-label="Cabin camera positions">
      {config.cameras.map((camera, index) => (
        <button
          key={camera.name}
          className={`${styles.btn} ${activeCameraIndex === index ? styles.active : ''}`}
          onClick={() => setActiveCameraIndex(index)}
          aria-pressed={activeCameraIndex === index}
          aria-label={`Go to ${camera.name}`}
        >
          {camera.name}
        </button>
      ))}
    </nav>
  )
}
