import { useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { AppConfig } from '@/types/config'

export function useConfig() {
  const { config, setConfig, setLoadProgress } = useAppStore()

  useEffect(() => {
    if (config) return

    fetch('/config.json?' + Date.now())
      .then((r) => r.json())
      .then((data: AppConfig) => {
        setConfig(data)
        setLoadProgress(5)
      })
      .catch(console.error)
  }, [config, setConfig, setLoadProgress])

  return config
}
