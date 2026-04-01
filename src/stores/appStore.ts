import { create } from 'zustand'
import type { AppConfig, TurntableHotspot } from '@/types/config'

export type ActiveView = 'exterior' | 'cabin'

interface AppState {
  // Config
  config: AppConfig | null
  setConfig: (config: AppConfig) => void

  // Loading
  isLoaded: boolean
  loadProgress: number
  setLoadProgress: (progress: number) => void
  setIsLoaded: (loaded: boolean) => void

  // View
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void

  // Night mode
  isNightMode: boolean
  toggleNightMode: () => void

  // Turntable
  currentFrame: number
  setCurrentFrame: (frame: number) => void
  zoomLevel: number
  setZoomLevel: (zoom: number) => void

  // Hotspots
  activeHotspot: TurntableHotspot | null
  setActiveHotspot: (hotspot: TurntableHotspot | null) => void

  // Cabin
  activeCameraIndex: number
  setActiveCameraIndex: (index: number) => void

  // Guide
  guideVisible: boolean
  dismissGuide: () => void
}

const GUIDE_DISMISSED_KEY = 'd328eco-guide-dismissed'

export const useAppStore = create<AppState>((set, get) => ({
  // Config
  config: null,
  setConfig: (config) => set({ config }),

  // Loading
  isLoaded: false,
  loadProgress: 0,
  setLoadProgress: (progress) => set({ loadProgress: Math.min(100, progress) }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),

  // View
  activeView: 'exterior',
  setActiveView: (view) => set({ activeView: view }),

  // Night mode
  isNightMode: false,
  toggleNightMode: () => set((s) => ({ isNightMode: !s.isNightMode })),

  // Turntable
  currentFrame: 3,
  setCurrentFrame: (frame) => {
    const config = get().config
    if (!config) return
    const count = config.turntable.frameCount
    set({ currentFrame: ((frame % count) + count) % count })
  },
  zoomLevel: 0.5,
  setZoomLevel: (zoom) => {
    const config = get().config
    if (!config) return
    const { min, max } = config.turntable.zoom
    set({ zoomLevel: Math.min(max, Math.max(min, zoom)) })
  },

  // Hotspots
  activeHotspot: null,
  setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),

  // Cabin
  activeCameraIndex: 1,
  setActiveCameraIndex: (index) => set({ activeCameraIndex: index }),

  // Guide
  guideVisible: !localStorage.getItem(GUIDE_DISMISSED_KEY),
  dismissGuide: () => {
    localStorage.setItem(GUIDE_DISMISSED_KEY, '1')
    set({ guideVisible: false })
  },
}))
