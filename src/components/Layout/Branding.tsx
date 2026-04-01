import styles from './Branding.module.css'

export default function Branding() {
  return (
    <div className={styles.branding}>
      <div className={styles.top}>
        <img
          src="/images/favicon.png"
          alt="Deutsche Aircraft logo"
          className={styles.logo}
        />
        <p className={styles.company}>
          DEUTSCHE<br />AIRCRAFT
        </p>
      </div>
      <div className={styles.bottom}>
        <p className={styles.model}>D328eco</p>
      </div>
    </div>
  )
}
