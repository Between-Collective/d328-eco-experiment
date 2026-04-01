import { Suspense, lazy } from 'react'
import type { AppConfig } from '@/types/config'
import styles from './CabinView.module.css'

// Lazy-load the heavy Babylon.js panorama — only fetched when Cabin is first opened
const PanoramaScene = lazy(() => import('./PanoramaScene'))

interface Props {
  config: AppConfig
}

export default function CabinView({ config }: Props) {
  return (
    <div className={styles.container}>
      <Suspense
        fallback={
          <div className={styles.fallback} aria-label="Loading cabin view">
            <span className={styles.spinner} aria-hidden="true" />
            <p>Loading cabin…</p>
          </div>
        }
      >
        <PanoramaScene config={config} />
      </Suspense>
    </div>
  )
}
