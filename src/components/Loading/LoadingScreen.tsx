import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  const { loadProgress } = useAppStore()

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      aria-live="polite"
      aria-label="Loading Deutsche Aircraft D328eco experience"
      role="status"
    >
      {/* Background aircraft silhouette */}
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.content}>
        {/* Logo + name */}
        <motion.div
          className={styles.brand}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src="/images/favicon.png"
            alt="Deutsche Aircraft logo"
            className={styles.logo}
          />
          <div className={styles.brandText}>
            <p className={styles.company}>DEUTSCHE AIRCRAFT</p>
            <p className={styles.model}>D328eco</p>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className={styles.tagline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          aria-hidden="true"
        >
          <p>Most Economical</p>
          <p>Most Versatile</p>
          <p>Most Advanced</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className={styles.progressWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${loadProgress}%` }}
            role="progressbar"
            aria-valuenow={loadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading: ${loadProgress}%`}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
