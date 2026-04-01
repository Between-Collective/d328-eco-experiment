import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import { useConfig } from '@/hooks/useConfig'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import LoadingScreen from '@/components/Loading/LoadingScreen'
import Layout from '@/components/Layout/Layout'
import styles from './App.module.css'

export default function App() {
  const config = useConfig()
  const { isLoaded, isNightMode } = useAppStore()

  useImagePreloader(config)

  // Apply night mode to root element for CSS variable cascade
  useEffect(() => {
    document.documentElement.dataset.night = String(isNightMode)
  }, [isNightMode])

  return (
    <div className={styles.app}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AnimatePresence mode="wait">
        {!isLoaded && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {config && <Layout config={config} />}
    </div>
  )
}
