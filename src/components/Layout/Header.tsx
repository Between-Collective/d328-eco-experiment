import { useAppStore, type ActiveView } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'
import styles from './Header.module.css'

interface Props {
  config: AppConfig
}

export default function Header({ config: _config }: Props) {
  const { activeView, setActiveView } = useAppStore()

  const handleSwitch = (view: ActiveView) => {
    setActiveView(view)
  }

  return (
    <header className={styles.header} role="banner">
      {/* Mobile branding inline */}
      <div className={styles.mobileBranding} aria-hidden="true">
        <img src="/images/favicon.png" alt="" className={styles.mobileLogo} />
      </div>

      <nav
        className={styles.toggle}
        role="navigation"
        aria-label="View selection"
      >
        <button
          className={`${styles.btn} ${activeView === 'exterior' ? styles.active : ''}`}
          onClick={() => handleSwitch('exterior')}
          aria-pressed={activeView === 'exterior'}
          aria-label="Switch to exterior view"
        >
          Exterior
        </button>
        <button
          className={`${styles.btn} ${activeView === 'cabin' ? styles.active : ''}`}
          onClick={() => handleSwitch('cabin')}
          aria-pressed={activeView === 'cabin'}
          aria-label="Switch to cabin view"
        >
          Cabin
        </button>
      </nav>
    </header>
  )
}
