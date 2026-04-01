import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  active?: boolean
  className?: string
}

export default function IconButton({ children, active = false, className = '', ...rest }: Props) {
  return (
    <button
      className={`${styles.btn} ${active ? styles.active : ''} ${className}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}
