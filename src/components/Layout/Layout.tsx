import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'
import Header from './Header'
import Toolbar from './Toolbar'
import Branding from './Branding'
import ExteriorView from '@/components/Exterior/ExteriorView'
import CabinView from '@/components/Cabin/CabinView'
import InteractionGuide from '@/components/Guide/InteractionGuide'
import styles from './Layout.module.css'

interface Props {
  config: AppConfig
}

export default function Layout({ config }: Props) {
  const { activeView, isLoaded } = useAppStore()

  return (
    <div
      className={styles.layout}
      data-view={activeView}
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
    >
      {/* Sidebar branding — visible on tablet+ */}
      <aside className={styles.sidebar} aria-label="Deutsche Aircraft branding">
        <Branding />
      </aside>

      {/* Main interactive area */}
      <main id="main-content" className={styles.main}>
        <Header config={config} />

        <div className={styles.canvas}>
          {activeView === 'exterior' ? (
            <ExteriorView config={config} />
          ) : (
            <CabinView config={config} />
          )}
        </div>

        <Toolbar config={config} />
      </main>

      {/* One-time interaction guide */}
      <InteractionGuide activeView={activeView} />
    </div>
  )
}
